var express = require('express');
//var bodyParser = require('body-parser');

var router = express.Router();
/* GET server page. */
router.get('/', function(req, res, next) {
	res.render('examples', { title: 'Turtle Examples' });
});

module.exports = router;
