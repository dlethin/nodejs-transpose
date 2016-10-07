// simplest way to make http requests.
const request = require('request')

/*
 * Perform an async get on a URL, transcoding
 * the characters return in the body by the supplied
 * shiftNum
*/
exports.shiftedBody = function(url, shiftNum) {

	var buffer = ''

	request(url)

		.on('error', function(err) {
	    console.error(err)})

		.on('data', function(data){
			buffer += data.toString()})
	
		.on('end', function() {

			var result = ''

	    for (i = 0; i < buffer.length; i++) {
        var charcode = (buffer[i].charCodeAt()) + shiftNum
        result += String.fromCharCode(charcode)
			}

		  console.log(result)
	})
}
