"use strict";

const 
  PORT = 5001,
  RESPONSE_DELAY_MS = 100,

  SERVER_RESPONSE="ABCabc123",
  TRANSPOSED_SERVER_RESPONSE = "BCDbcd234",

  http = require('http'),
  expect  = require("chai").expect,
  intercept = require("intercept-stdout"),

// function to test
shiftedBody = require('../lib/index.js').shiftedBody;

//Create a test server to server some content
let server = http.createServer(function(req, res) {

  // wait a bit before sending the response
  setTimeout(function() {
    res.end(SERVER_RESPONSE);
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

describe("shiftedBody", function() {

  it("transpose of 0", function(done) {
    let buf = '';

    // first let's intercept stdout
    let unhook_intercept = intercept(function(txt) {
      buf += txt;
    });

    // call test function on our test server
    shiftedBody("http://localhost:" + PORT + "/index.html", 0);

    let timer = setInterval(function() { 
      if (buf == (SERVER_RESPONSE + "\n")) {
        unhook_intercept();
        clearInterval(timer)
        console.log("buf is %s", buf);
        done();
      }
    }, 100);
  })

  it("non-blocking function", function(done) {

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
