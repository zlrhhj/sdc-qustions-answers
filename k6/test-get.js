import http from 'k6/http';
import { sleep, check, group } from 'k6';


export let options = {
   vus: 10,
   duration: "30s"
};


export default function () {

   /*
    var product_id = Math.floor(Math.random() * 100000);
    var question_id = Math.floor(Math.random() * 350000);
    var answer_id = Math.floor(Math.random() * 687000);
    */

    /*
    var product_id = Math.floor(Math.random() * 100000) + 450000;
    var question_id = Math.floor(Math.random() * 350000) + 1575000;
    var answer_id = Math.floor(Math.random() * 687000) + 3091500;
     */

    var product_id = Math.floor(Math.random() * 100000) + 900000;
    var question_id = Math.floor(Math.random() * 350000) + 3150000;
    var answer_id = Math.floor(Math.random() * 687000) + 6183000;
    //get requests

    group('get questions',() => {
      var queryParams = {
        product_id:product_id,
      }

      // Make a GET request to the URL
      const url =  `http://localhost:3000/qa/questions/?product_id=${product_id}`;
      const response = http.get(url);

      // Validate the response status
      check(response, {
          'status is 200': (r) => r.status === 200,
          'response time is below 500ms' : (r) => r.timings.duration < 500,
      });

    })

    group('get answers',() => {
      const url = `http://localhost:3000/qa/questions/${question_id}/answers`;
      const response = http.get(url);

      check(response, {
        'status is 200': (r) => r.status === 200,
        'response time is below 2000ms' :(r) => r.timings.duration < 2000,
      })

    });
    // Sleep for 1 second between iterations
    //sleep(1);
}