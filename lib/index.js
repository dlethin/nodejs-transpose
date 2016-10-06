// simplest way to make http requests.
var request = require('request')

/*
 * Perform an async get on a URL, transcoding
 * the characters return in the body by the supplied
 * shiftNum
*/
exports.shiftedBody = function(url, shiftNum) {

	request(url, function (error, response, body) {
		if (error) {
			console.error(error)
    } else if (response.statusCode != 200) {
      // TODO - how best to log this?
      console.error(body)      
		} else {
      
			var result = ''
			var charcode

		    for (i = 0; i < body.length; i++) {
		        charcode = (body[i].charCodeAt()) + shiftNum
		        result += String.fromCharCode(charcode)
			}

		    console.log(result)
		}
	})
}
