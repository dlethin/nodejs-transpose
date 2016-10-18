"use strict";

const 
  PORT = 5001,
  RESPONSE_DELAY_MS = 100,

  SERVER_RESPONSE="ABCabc123",
  TRANSPOSED_SERVER_RESPONSE = "BCDbcd234",

  http = require("http"),
  expect  = require("chai").expect,
  intercept = require("intercept-stdout"),

  // function to test
  shiftedBody = require("../lib/index.js").shiftedBody;

//Create a test server to server some content
let server = http.createServer((req, res) => {

  // wait a bit before sending the response
  setTimeout(() => {
    res.end(SERVER_RESPONSE);
  }, RESPONSE_DELAY_MS);
});

let serverStarted = false;

//Lets start our server
server.listen(PORT, err => {

  if (err) {
    throw err;
  }

  //Callback triggered when server is successfully listening. Hurray!
  //console.log("Server listening on: http://localhost:%s", PORT);
  serverStarted = true;
}); 

/*
 * A function to test the transposition of characters in the response.
 * shiftNum - the number of characters to shift
 *
 * will return buf which was captured by intercepting standard out 
*/
const wrapTranspose = (shiftNum) => {

  let buf = "";

  // first let's intercept stdout
  let unhook_intercept = intercept(txt => {
    buf += txt;
  });

  return new Promise((resolve, reject) => {

    // call test function on our test server
    shiftedBody("http://localhost:" + PORT + "/index.html", shiftNum)
    .then(() => {
      unhook_intercept();
      resolve(buf);
    })
    .catch(err => {
      unhook_intercept();
      reject(err);
    });
  });
};

describe("shiftedBody", () => {

  it("transpose of 0", done =>  {
    wrapTranspose(0).then(buf => {
      console.log(buf);
      try {
        expect(buf, "unexpected response").to.equal(`${SERVER_RESPONSE}\n`);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("transpose of 1", done =>  {
    wrapTranspose(1).then(buf => {
      console.log(buf);
      try {
        expect(buf, "unexpected response").to.equal(`${TRANSPOSED_SERVER_RESPONSE}\n`);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("non-blocking function", done => {

    // check in intervals if the server has been started
    let timer = setInterval(() => { 
      if (serverStarted) {
        clearInterval(timer);

        // server's up -- now test our function
        let start = (new Date).getTime();

        // Now let's call our server
        shiftedBody("http://localhost:" + PORT + "/index.html", 0);

        let end = (new Date).getTime();
        let delta = end - start;

        expect(delta, "Suspect blocking function?").to.be.lt(RESPONSE_DELAY_MS);
        done();
      }
    }, 100);
  });
});
