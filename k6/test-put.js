import http from 'k6/http';
import { sleep, check, group } from 'k6';

export let options = {
   vus: 1000,
   duration: "30s"
};

export default function () {

   /*
    var product_id = Math.floor(Math.random() * 100000);
    var question_id = Math.floor(Math.random() * 350000);
    var answer_id = Math.floor(Math.random() * 687000);
    */

    var product_id = Math.floor(Math.random() * 100000) + 900000;
    var question_id = Math.floor(Math.random() * 350000) + 3150000;
    var answer_id = Math.floor(Math.random() * 687000) + 6183000;

    // put requests
    group('put request for marking questions as helpful', () => {
      console.log(question_id);
      const url = `http://localhost:3000/qa/questions/${question_id}/helpful`;
      const response = http.put(url);
      check(response, {
        'status is 204' : (r) => r.status === 204,
        'response time is below 2000ms' : (r) => r.timings.duration < 2000
      });
    });

    group('put request for Reporing Question',() => {
      const url = `http://localhost:3000/qa/questions/${question_id}/report`;
      const response = http.put(url);
      check(response, {
        'status is 204' : (r) => r.status === 204,
        'response time is below 2000ms' : (r) => r.timings.duration < 2000
      });
    });

    group('put request for Marking answer as helpful', () => {
      const url = `http://localhost:3000/qa/answers/${answer_id}/helpful`;
      const response = http.put(url);
      check(response, {
        'status is 204' : (r) => r.status === 204,
        'response time is below 2000ms' : (r) => r.timings.duration < 2000
      });
    });

    group('put request for Reporting Answer', () => {
      const url = `http://localhost:3000/qa/answers/${answer_id}/report`;
      const response = http.put(url);
      check(response, {
        'status is 204' : (r) => r.status === 204,
        'response time is below 2000ms' : (r) => r.timings.duration < 2000
      });
    });

    // Sleep for 1 second between iterations
    sleep(1);
}