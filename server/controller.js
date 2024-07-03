const {getAnswers, getQuestions, addQuestion,addAnswer,addAnswerWithPhotos,markQuestionHelpful, questionReported,markAnswerHelpful, answerReported} = require('./model.js');

module.exports.getQuestions = (req, res) => {
  var product_id = req.query.product_id;
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  getQuestions(product_id, page, count)
    .then((results) => {
      var questions = {};
      questions.product_id = product_id;
      questions.results = results;
      res.status(200).send(questions);
    })
    .catch((err) => {
      res.status(400).send(err);
    })
};

module.exports.getAnswers = (req, res) => {
  var question_id = req.params.question_id;
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  getAnswers(question_id, page, count)
    .then((results) => {
      var answers = {};
      answers.question = question_id;
      answers.page = page;
      answers.count = count;
      answers.results = results;
      res.status(200).send(answers);
    })
    .catch((err) => {
      res.status(400).send(err);
    })
}

module.exports.addQuestion = (req, res) => {
  var question = req.body;
  console.log(question);
  addQuestion(question)
    .then((result) => {
      res.status(201).send("CREATED");
    })
    .catch((err) => {
      res.status(400).send(err);
    })
}

module.exports.addAnswer = (req, res) => {
  var answer = [req.params.question_id, req.body.body, req.body.name, req.body.email];
  var photos = req.body.photos;
  if(photos.length === 0) {
    addAnswer(answer)
      .then((result) => {
        res.status(201).send("CREATED");
      })
      .catch((err) => {
        res.status(400).send(err);
      })
  } else {
    addAnswerWithPhotos(answer, photos)
      .then((result) => {
        res.status(201).send("CREATED");
      })
      .catch((err) => {
        res.status(400).send(err);
      })
  }
}

module.exports.markQuestionHelpful = (req, res) => {
  console.log(req.params);
  const question_id = req.params.question_id;
  markQuestionHelpful(question_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(400).send(err);
    })
}

module.exports.questionReported = (req, res) => {
  const question_id = req.params.question_id;
  questionReported(question_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(400).send(err);
    })
}

module.exports.markAnswerHelpful = (req, res) => {
  const answer_id = req.params.answer_id;
  markAnswerHelpful(answer_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(400).send(err);
    })
}

module.exports.answerReported = (req, res) => {
  answerReported(req.params.answer_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(400).send(err);
    })
}