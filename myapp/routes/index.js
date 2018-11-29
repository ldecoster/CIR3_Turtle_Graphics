var express = require('express');
//var bodyParser = require('body-parser');

var router = express.Router();
/* GET server page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Turtle Graphic' });
});

router.post('/', function(req, res, next) {
	console.log('Get data : ' + JSON.stringify(req.body));
	var command_array = getJison(req.body.data);
	res.send(command_array);
});

var getJison = function(stringInput) {
	var fs = require("fs");
	var jison = require("jison");

	var bnf = fs.readFileSync("test.jison", "utf8");
	var parser = new jison.Parser(bnf);

	var command_array = parser.parse(stringInput);

	console.log(command_array);
	return command_array;
};


module.exports = router;
