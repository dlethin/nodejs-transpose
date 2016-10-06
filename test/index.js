var transpose=require('../lib/index.js');

if (process.argv.length < 4) {
  
	console.error('Please supply url and shift amount')
} else {

	var url=process.argv[2]
	var shiftNum = parseInt(process.argv[3])

	if (shiftNum == NaN) {
		console.error('please supply valid shift amount')
	} else {
		transpose.shiftedBody(url, shiftNum)
	}
}
