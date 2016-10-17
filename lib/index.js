"use strict";

// simplest way to make http requests.
const request = require("request");

/*
 * Perform an async get on a URL, transcoding
 * the characters return in the body by the supplied
 * shiftNum
*/
exports.shiftedBody = function(url, shiftNum) {

  let buffer = "";

  request(url)

    .on("error", function(err) {
     // no cb to pass this too -- just log it
      console.error(err);
    })
    .on("data", function(data){
      buffer += data.toString();
    })
    .on("end", function() {

      let result = "";

      for (let i = 0; i < buffer.length; i++) {
        let charcode = (buffer[i].charCodeAt()) + shiftNum;
        result += String.fromCharCode(charcode);
      }

      console.log(result);
    });
};
