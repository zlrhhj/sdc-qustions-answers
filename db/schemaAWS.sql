DROP DATABASE IF EXISTS qa;
CREATE DATABASE qa;

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id INTEGER NOT NULL,
  question_body VARCHAR(1000) NOT NULL ,
  question_date BIGINT NOT NULL,
  asker_name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  product_id INTEGER NOT NULL,
  question_helpfulness INTEGER NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (id)
);

CREATE SEQUENCE question_seq_id INCREMENT 1 START 1 OWNED BY questions.id;

DROP TABLE IF EXISTS answers;

CREATE TABLE answers (
  id INTEGER NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date BIGINT NOT NULL,
  email VARCHAR(60) NOT NULL,
  answerer_name VARCHAR NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  helpfulness INTEGER NOT NULL DEFAULT 0,
  question_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE SEQUENCE answer_seq_id INCREMENT 1 START 1 OWNED BY answers.id;

CREATE TABLE photos (
  id INTEGER NOT NULL ,
  url VARCHAR NOT NULL,
  answer_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE SEQUENCE photo_seq_id INCREMENT 1 START 1 OWNED BY photos.id;

CREATE INDEX IF NOT EXISTS product_id_idx ON questions(product_id);
CREATE INDEX IF NOT EXISTS question_id_idx ON answers(question_id);
CREATE INDEX IF NOT EXISTS answer_id_idx ON photos(answer_id);