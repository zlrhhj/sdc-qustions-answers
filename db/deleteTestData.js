require("dotenv").config();
const { Pool} = require("pg");
const pool = new Pool ({
  database: 'qa',
  port: 5432,
  user: 'postgres',
  host: 'localhost',
  password: 'root',
});
const deleteTestData = () => {

  try {
    pool.query('DELETE FROM photos WHERE id > 2063759')
      .then((res)=>{
        console.log(`Deleted ${res.rowCount} test data from table photos`);
        pool.query(`SELECT setval('photo_id_seq', (SELECT MAX(id) FROM photos))`);
      })
      .catch((err)=>{
        console.log("Delete test data from table photos failed: ", err.stack);
      })
    pool.query('DELETE FROM answers WHERE id > 6879306')
      .then((res) => {
        console.log(`Deleted ${res.rowCount} test data from table answers`);
        pool.query(`SELECT setval('answer_id_seq',(SELECT MAX(id) FROM answers))`);
      })
    pool.query('DELETE FROM questions WHERE id > 3518963')
      .then((res) =>{
        console.log(`Deleted ${res.rowCount} test data from table questions`);
        pool.query(`SELECT setval('question_id_seq',(SELECT MAX(id) FROM questions))`);
      })
  } catch(err) {
    console.error('Error deleting the test data', err);
  }
}

deleteTestData();




