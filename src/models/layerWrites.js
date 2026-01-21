import pool from "../config/db.js";

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

export { saveLayer }