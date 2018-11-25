var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();

/* GET server page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Turtle Graphic' });
});

router.post('/', function(req, res, next) {
	console.log('Get data : ' + JSON.stringify(req.body));
	res.send(req.body);
 	//var p1 = req.body.p1; 
 	//console.log("p1=" + p1);
 	//res.render('index', { title: 'Turtle Graphic' });
});

module.exports = router;
