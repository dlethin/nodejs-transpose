// simplest way to make http requests.
var request = require('request')
var stream = require('stream')
var util = require('util')


// **************************************************************
// Inspired by: https://nodejs.org/api/stream.html#stream_implementing_a_transform_stream


var Transform = stream.Transform

// First create a ShiftedBody clas (using pre-ES6 style constructors)
function ShiftedBody(options) {
  // allow use without new
  if (!(this instanceof ShiftedBody)) {
    return new ShiftedBody(options)
  }

  // init Transform
  Transform.call(this, options)

  // default shiftNum to 0
  this.shiftNum = 0
}

util.inherits(ShiftedBody, Transform)

// Now provide an implementation for the _transform method
ShiftedBody.prototype._transform = function (chunk, enc, cb) {

	// chunk can be a string or buffer -- call toString()
	var buffer = chunk.toString()
	var result = ''

  for (i = 0; i < buffer.length; i++) {
        var charcode = (buffer[i].charCodeAt()) + this.shiftNum
        result += String.fromCharCode(charcode)
			}

  this.push(result)
  cb()
}

/*
 * Perform an async get on a URL, transcoding
 * the characters return in the body by the supplied
 * shiftNum
*/
exports.shiftedBody = function(url, shiftNum) {

	var buffer = ''

	var shiftedBody = new ShiftedBody();
	
	// make sure to set desired shiftnum
	shiftedBody.shiftNum = shiftNum

	request(url)

		.on('error', function(err) {
	    console.error(err)})
		.pipe(shiftedBody)
		.pipe(process.stdout)
}
