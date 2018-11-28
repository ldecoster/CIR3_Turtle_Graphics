var express = require('express');
//var bodyParser = require('body-parser');

var router = express.Router();
/* GET server page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Turtle Graphic' });
});

router.post('/', function(req, res, next) {
	console.log('Get data : ' + JSON.stringify(req.body));
	test(req.body.data);
	res.send(req.body);
 	//var p1 = req.body.p1; 
 	//console.log("p1=" + p1);
 	//res.render('index', { title: 'Turtle Graphic' });
});

var test = function(stringInput) {
	var fs = require("fs");
	var jison = require("jison");

	var bnf = fs.readFileSync("test.jison", "utf8");
	var parser = new jison.Parser(bnf);

	t = parser.parse(stringInput);
	console.log(t);
};


module.exports = router;
