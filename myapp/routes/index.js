var express = require('express');

var router = express.Router();

/* GET server page. */
router.get('/', function(req, res) {
	res.render('index');
});

router.post('/grammar', function(req, res) {
	console.log('Get data : ' + JSON.stringify(req.body));
	var command_array = getJison(req.body.data);
	res.send(command_array);
});

var getJison = function(stringInput) {
	var fs = require("fs");
	var jison = require("jison");

	var bnf = fs.readFileSync("grammar.jison", "utf8");
	var parser = new jison.Parser(bnf);

	var command_array = parser.parse(stringInput);

	console.log(command_array);
	return command_array;
};

router.post('/save', function(req, res) {
	console.log('Perfoming save request...');
	var svgContent = req.body.drawing;
	var fs = require("fs");
	fs.writeFile('svgResult.svg', svgContent, function(err) {
		if(err) {
			throw err;
		}
		console.log('File saved !');
		res.send('Fichier enregistré avec succès');
	});
});


module.exports = router;
