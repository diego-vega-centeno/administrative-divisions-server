import pool from "../config/db.js";

async function getUserLayersRelations(userId){
  const response = await pool.query(`
    SELECT ly.id, ly.title, lr.osm_relation_id, lr.osm_relation_name 
    FROM layers as ly
    JOIN users ON users.id = ly.user_id
    JOIN layer_relations as lr ON lr.layer_id = ly.id
    WHERE users.id = $1`, [userId]);
    console.log(response.rows);
    return response.rows;
}

export {getUserLayersRelations}