const {pool} = require ('../db/db.js');

module.exports.getQuestions = async function(product_id, page, count) {

  try {
    let offset = 0;
    let limit = null;
    if( page && count ) {
      offset = (page - 1) * count;
      limit = count;
    }
    const query = {
      text: `SELECT
              q.id AS qustion_id,
              q.question_body,
              q.question_date,
              q.asker_name,
              q.question_helpfulness,
              q.reported,
              (
                SELECT COALESCE(JSON_OBJECT_AGG(key,value),'{}')
                  FROM
                    (SELECT answerobj.id as key,
                            answerobj as value
                    FROM
                      (SELECT
                        a.id,
                        a.body,
                        a.date,
                        a.answerer_name,
                        a.helpfulness,
                        (SELECT COALESCE(JSON_AGG(photolist),'[]')
                          FROM
                            (SELECT photos.url FROM photos WHERE a.id = photos.answer_id) as photolist)
                          AS photos
                       FROM answers a
                       WHERE a.question_id = q.id
                      ) AS answerobj
                    )

              ) AS answers
              FROM questions q\
              WHERE q.product_id = ${product_id} and q.reported=false\
              ORDER BY q.id\
              OFFSET ${offset}\
              LIMIT ${limit} `,
    }
    let result = await pool.query(query);
    return result.rows;
  } catch(err) {
    console.error('Error getting the questions', err.stack)
  }
}


module.exports.getAnswers = async function (question_id, page, count) {
  try{
    let offset = 0;
    let limit = null;
    if(page && count) {
      offset = (page - 1) * count;
      limit = count;
    }
    const query = {
      text :`SELECT
                a.id AS answer_id,
                a.body,
                a.date,
                a.answerer_name,
                a.helpfulness,
                (
                  SELECT (COALESCE (JSON_AGG(photolist), '[]'))
                    FROM (
                          SELECT photos.id, photos.url
                          FROM photos
                          WHERE photos.answer_id = a.id
                        ) as photolist
                ) as photos
            FROM answers a
            WHERE a.question_id = ${question_id} and a.reported = false
            ORDER BY a.id
            OFFSET ${offset}
            LIMIT ${limit}`,
    };
    const result =  await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error getting the answers", err.stack)
  }
}

module.exports.addQuestion = async function(question) {
  console.log(question);
  const query = {
    text: `INSERT INTO questions (id, question_body, asker_name, email, product_id, question_date)
            VALUES (nextval('question_id_seq'),'${question.body}', '${question.name}', '${question.email}', ${question.product_id},(SELECT LOCALTIMESTAMP)) `,
  }
  console.log(query.text);
  const result = await pool.query(query);
  return result;
};

module.exports.addAnswer = async function(answer) {
  const query = {
    text : `INSERT INTO answers (question_id, body, answerer_name, email)
              VALUES ($1,$2,$3,$4)`
  }
  const result = await pool.query(query, answer);
  return result;
}

module.exports.addAnswerWithPhotos = async function(answer, photos) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query1 = {
      text : `INSERT INTO answers (question_id, body, answerer_name, email)
                VALUES ($1,$2,$3,$4)
                RETURNING id`,
    }

    const result = await client.query(query1, answer);
    const ans_id = result.rows[0].id;
    await Promise.all(photos.map( async (photo) => {
      const query2 = `INSERT INTO photos (url, answer_id)
               VALUES('${photo}', ${ans_id}) `;
      await client.query(query2);
    }))
    await client.query('COMMIT');
    console.log('Add an answer with photos successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting answer: ', err);
    throw err;
  } finally {
     client.release();
  }
}

module.exports.markQuestionHelpful = async function(question_id) {
  const query = {
    text: `UPDATE questions SET question_helpfulness = question_helpfulness + 1
            WHERE id = ${question_id}`,
  }
  const result = pool.query(query);
  return result.rows;
};

module.exports.questionReported = async function(question_id) {
  const query = {
    text: `UPDATE questions SET reported = true WHERE id = ${question_id}`,
  }
  const result = pool.query(query);
  return result.rows;
}

module.exports.markAnswerHelpful = async function(answer_id) {
  const query = {
    text :`UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = ${answer_id}`,
  };
  const result = pool.query(query);
  return result.rows;
}

module.exports.answerReported = async function(answer_id) {
  const query = `UPDATE answers SET reported = true WHERE id = ${answer_id}`;
  return (pool.query(query)).rows;
}