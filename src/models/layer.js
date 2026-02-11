import pool from "../config/db.js";

async function getUserLayersRelations(userId) {
  const response = await pool.query(`
    SELECT lr.id, ly.id as layer_id, ly.title as layer_title, lr.osm_relation_id, lr.osm_relation_name 
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

async function changeLayerTitle(layerId, newTitle) {
  const response = await pool.query(`
    UPDATE layers 
    SET title = $2
    WHERE id = $1
    RETURNING title`, [layerId, newTitle]);
  return response.rows[0].title;
}

async function deleteRelations(layerId, relsIds) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE FROM layer_relations WHERE id = ANY($1::uuid[])`,
      [relsIds]
    );

    await client.query(`
      DELETE FROM layers as ly
      WHERE ly.id = $1 
      AND NOT EXISTS (
        SELECT 1
        FROM layer_relations as lr
        WHERE lr.layer_id = ly.id
      )`,
      [layerId]
    )
    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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
    const relsAdminLevels = relations.map(rel => rel.adminLevel);
    const relsParentsNames = relations.map(rel => rel.parentsNames);
    const layersIds = new Array(relsIds.length).fill(layerId);

    await client.query(`
      INSERT INTO layer_relations (layer_id, osm_relation_id, osm_relation_name, parents_names, admin_level)
      SELECT * FROM unnest($1::uuid[], $2::varchar[], $3::varchar[], $4::text[], $5::varchar[])
    `, [layersIds, relsIds, relsNames, relsParentsNames, relsAdminLevels]);

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

export {
  getUserLayersRelations, saveLayer, deleteLayer, getLayerRelations,
  deleteRelations, changeLayerTitle
}