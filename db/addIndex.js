require("dotenv").config();
const { Pool} = require("pg");
const pool = new Pool ({
  database: 'qa',
  port: 5432,
  user: 'postgres',
  host: 'localhost',
  password: 'root',
});
const addIndex = () => {

  try {
    pool.query('CREATE INDEX IF NOT EXISTS product_id_idx ON questions(product_id)');
    pool.query('CREATE INDEX IF NOT EXISTS question_id_idx ON answers(question_id)');
    pool.query('CREATE INDEX IF NOT EXISTS answer_id_idx ON photos(answer_id)');
  } catch(err) {
    console.error('Error creating indexes:', err.stack)
  }
}

addIndex();




