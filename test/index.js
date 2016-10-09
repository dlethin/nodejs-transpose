"use strict";

const 
  PORT = 5001,
  RESPONSE_DELAY_MS = 100,

  http = require('http'),
  expect  = require("chai").expect,
  
  // function to test
  shiftedBody = require('../lib/index.js').shiftedBody;

describe("shiftedBody", function() {
  it("non-blocking function", function(done) {

    // note since shiftedBody function writes to 
    // stdout, we can't (or at least I haven't thought
    // of a way yet) we can't easily test that the
    // transposition is correct.  We're ONLY testing
    // that the function is non-blocking

    //Create a test server to server some content
    let server = http.createServer(function(req, res) {

      // wait a bit before sending the response
      setTimeout(function() {
        res.end('Finally...');
      }, RESPONSE_DELAY_MS);
    });

    let serverStarted = false;

    //Lets start our server
    server.listen(PORT, function(err) {

      if (err) {
        throw err;
      }

      //Callback triggered when server is successfully listening. Hurray!
      //console.log("Server listening on: http://localhost:%s", PORT);
      serverStarted = true;
    }); 

    // check in intervals if the server has been started
    let timer = setInterval(function() { 
      if (serverStarted) {
        clearInterval(timer);

        // server's up -- now test our function
        let start = (new Date).getTime();

        // Now let's call our server
        shiftedBody("http://localhost:" + PORT + "/index.html", 0);

        let end = (new Date).getTime();
        let delta = end - start;

        expect(delta).to.be.lt(RESPONSE_DELAY_MS);
        done();
      }
    }, 100);
  });
});
