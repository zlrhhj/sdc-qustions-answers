\COPY photos(id, answer_id,url) FROM 'datafiles/answers_photos.csv' DELIMITER ',' CSV HEADER;
\COPY answers(id, question_id,body, date, answerer_name, email, reported, helpfulness) FROM 'datafiles/answers.csv' DELIMITER ',' CSV HEADER;
\COPY questions(id,product_id, question_body, question_date, asker_name, email, reported, question_helpfulness) FROM 'datafiles/questions.csv' DELIMITER ',' CSV HEADER;

SELECT setval('question_seq_id', (SELECT MAX(id) FROM questions));
SELECT setval('answer_seq_id',(SELECT MAX(id) FROM answers));
SELECT setval('photos_seq_id',(SELECT MAX(id) FROM photos))

ALTER TABLE questions ALTER COLUMN question_date SET DATA TYPE timestamp with time zone USING to_timestamp(question_date/1000);
ALTER TABLE answers ALTER COLUMN date SET DATA TYPE timestamptz USING to_timestamp(date/1000);

ALTER TABLE answers ADD CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions(id);
ALTER TABLE photos ADD CONSTRAINT fk_answer FOREIGN KEY (answer_id) REFERENCES answers(id);