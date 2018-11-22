const util = require('util');
var fs = require("fs");
var jison = require("jison");

var bnf = fs.readFileSync("test.jison", "utf8");
var parser = new jison.Parser(bnf);

t = parser.parse("AVANCER 10,15;AVANCER 100,105; BITE 140,42;");
//console.log(util.inspect(parser.yy.command_array,false,null,true));
console.log(t);