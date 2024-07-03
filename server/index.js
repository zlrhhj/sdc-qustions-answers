require('newrelic');
const express = require('express');
const controller = require('./controller.js');

const app = express();
app.use(express.json());

app.get('/qa/questions/',controller.getQuestions);
app.get('/qa/questions/:question_id/answers', controller.getAnswers);
app.post('/qa/questions/', controller.addQuestion);
app.post('/qa/questions/:question_id/answers',controller.addAnswer);
app.put('/qa/questions/:question_id/helpful',controller.markQuestionHelpful);
app.put('/qa/questions/:question_id/report',controller.questionReported);
app.put('/qa/answers/:answer_id/helpful', controller.markAnswerHelpful);
app.put('/qa/answers/:answer_id/report', controller.answerReported);

const port = 3000;
app.listen(port,()=>{
  console.log('App listening on port ', port);
})
