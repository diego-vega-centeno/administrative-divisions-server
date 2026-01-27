import pg from 'pg'

const testEnvs = ['test', 'development'];

const pool = new pg.Pool({
  // if it has value this key will override other connection keys
  connectionString: testEnvs.includes(process.env.NODE_ENV) ?
    undefined :
    process.env.SUPABASE_POSTGRE_DIRECT_URI,
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.TEST_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

export default pool;