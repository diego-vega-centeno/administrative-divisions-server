import pg from 'pg'

const testEnvs = ['test', 'development'];

const pool = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: testEnvs.includes(process.env.NODE_ENV) ? process.env.TEST_DATABASE : process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

export default pool;