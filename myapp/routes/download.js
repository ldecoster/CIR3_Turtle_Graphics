var express = require('express');
//var bodyParser = require('body-parser');

var router = express.Router();
/* GET server page. */

router.get('/:extension', function(req, res){
	var extension = req.params.extension;
	res.set("Content-Disposition", "attachment;filename=drawingResult."+extension);
	res.set("Content-Type", "application/octet-stream");
	res.download(__dirname + '/../drawingResult.'+extension, 'drawingResult.'+extension);
});

module.exports = router;