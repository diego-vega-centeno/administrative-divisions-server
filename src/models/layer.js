import pool from "../config/db.js";

async function getUserLayersRelations(userId) {
  const response = await pool.query(`
    SELECT ly.id as layer_id, ly.title as layer_title, lr.osm_relation_id, lr.osm_relation_name 
    FROM layers as ly
    JOIN users ON users.id = ly.user_id
    JOIN layer_relations as lr ON lr.layer_id = ly.id
    WHERE users.id = $1`, [userId]);

  return response.rows;
}

async function deleteLayer(layerId) {
  await pool.query(`
    DELETE FROM layers WHERE id = $1`, [layerId])
}

async function saveLayer(userId, title, relations) {
  const client = await pool.connect();
  // Handle operations as transaction
  try {
    await client.query('BEGIN');

    // save layer
    const layerResult = await client.query(`
    INSERT INTO layers (user_id, title)
    VALUES ($1, $2)
    RETURNING id`, [userId, title]);

    const layerId = layerResult.rows[0].id;

    // save relations from layer
    const relsIds = relations.map(rel => rel.relId);
    const relsNames = relations.map(rel => rel.relName);
    const layersIds = new Array(relsIds.length).fill(layerId);

    await client.query(`
      INSERT INTO layer_relations (layer_id, osm_relation_id, osm_relation_name)
      SELECT * FROM unnest($1::uuid[], $2::varchar[], $3::varchar[])
    `, [layersIds, relsIds, relsNames]);

    // commit and return successful layer
    await client.query('COMMIT');
    return layerId;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getLayerRelations(layerId) {
  const relsResult = await pool.query(`
    SELECT ly.title, lr.* 
    FROM layer_relations AS lr 
    JOIN layers AS ly ON ly.id = lr.layer_id 
    WHERE ly.id = $1`, [layerId]);

  return relsResult.rows;
}

export { getUserLayersRelations, saveLayer, deleteLayer, getLayerRelations }