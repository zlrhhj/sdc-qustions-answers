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


    //post request
    group('post question',() => {
      const payload = JSON.stringify({
        product_id : product_id,
        name : 'k6-tester',
        email: 'k6-tester@test.com',
        body: 'Hey, this is a question post test '
      });
      const url = 'http://localhost:3000/qa/questions/';

      const params = {
        headers: {'Content-Type': 'application/json'},
      }

      const response = http.post(url, payload, params);

      check(response, {
        'status is 201': (r) => r.status === 201,
        'response time is below 2000ms' :(r) => r.timings.duration < 2000,
      })

    });

    group('post answer', () => {
      var payload = JSON.stringify({
        name:'k6-tester',
        email: 'k6-tester@answer.com',
        body: 'this is a post answer body',
        photos: ['https://images.unsplash.com/photo-1517438476312-10d79c077509?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80']
      });

      const params = {
        headers : {
            'Content-Type': 'application/json',
        }
      }
      const url = `http://localhost:3000/qa/questions/${question_id}/answers`;
      const response = http.post(url, payload, params);
      check(response,{
        'status is 201' :(r) => r.status === 201,
        'response time is below 2000ms' : (r) => r.timings.duration < 2000,
      });
    });



    // Sleep for 1 second between iterations
    sleep(1);
}