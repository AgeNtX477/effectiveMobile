const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'your_password',
  host: 'localhost',
  port: 5432,
  database: 'your_database_name',
});

module.exports = pool;
