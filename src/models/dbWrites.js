import pool from '../config/db.js'

const saveFavorites = async (userId, osmRelId, osmRelName) => {
  try {
    const result = await pool.query(`
      INSERT INTO favorites (user_id, osm_relation_id, name) 
      VALUES ($1, $2, $3)`,
    [userId, osmRelId, osmRelName]);
    return result;
  } catch (error) {
    throw new Error('Failed to save favorite: ' + error.message);
  }
}

export { saveFavorites }