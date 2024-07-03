require("dotenv").config();
const {Client, Pool} = require("pg");

module.exports.client = new Client ({
  database: process.env.DB_NAME,
  port: 5432,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
});

module.exports.pool = new Pool ({
  database: process.env.DB_NAME,
  port: 5432,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
});