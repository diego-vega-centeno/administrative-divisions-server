import pool from '../config/db.js'

const saveFavorites = async (userId, rels) => {
  const relsIds = rels.map(ele => ele.osmRelId);
  const relsNames = rels.map(ele => ele.osmRelName);
  const userIds = Array(relsIds.length).fill(userId);

  await pool.query(`
    INSERT INTO favorites (user_id, osm_relation_id, osm_relation_name) 
    SELECT * FROM unnest($1::uuid[], $2::varchar[], $3::varchar[])
    ON CONFLICT (user_id, osm_relation_id)
    DO UPDATE SET 
    osm_relation_name = EXCLUDED.osm_relation_name,
    created_at = NOW()`, [userIds, relsIds, relsNames]);
}

export { saveFavorites }