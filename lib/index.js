"use strict";

// simplest way to make http requests.
const request = require("request");

/*
 * Perform an async get on a URL, transcoding
 * the characters return in the body by the supplied
 * shiftNum
*/
exports.shiftedBody = (url, shiftNum) => {

  return new Promise((resolve, reject) => {

    let buffer = "";

    request(url)

      .on("error", err => {
        reject(err);
      })
      .on("data", data => {
        buffer += data.toString();
      })
      .on("end", () => {

        let result = "";

        for (let i = 0; i < buffer.length; i++) {
          let charcode = (buffer[i].charCodeAt()) + shiftNum;
          result += String.fromCharCode(charcode);
        }

        console.log(result);

        resolve();
      });
  });
};
