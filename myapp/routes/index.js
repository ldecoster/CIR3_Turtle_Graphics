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
	var gm = require("gm");
	var response = '';

	// Enregistrement du SVG
	fs.writeFileSync('drawingResult.svg', svgContent);

	// Enregistrement du JPG
	gm("drawingResult.svg")
	.background('#FFFFFF')
	.write('drawingResult.jpg', function (err) {
		if (err) return console.dir(arguments)
			console.log(this.outname + " created  ::  " + arguments[3])
	});

	// Enregistrement du PNG
	gm("drawingResult.svg")
	.background('transparent')
	.write('drawingResult.png', function (err) {
		if (err) return console.dir(arguments)
			console.log(this.outname + " created  ::  " + arguments[3])
	});

	console.log('Files saved !');
	res.send('Fichiers enregistré avec succès');
});


module.exports = router;
