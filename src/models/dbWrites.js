import pool from '../config/db.js'

const saveFavorites = async (userId, osmRelId, osmRelName) => {
  return await pool.query(`
    INSERT INTO favorites (user_id, osm_relation_id, name) 
    VALUES ($1, $2, $3)`,
  [userId, osmRelId, osmRelName])
}

export { saveFavorites }