var fs = require("fs");
var jison = require("jison");

var bnf = fs.readFileSync("calculator.jison", "utf8");
var parser = new jison.Parser(bnf);

parser.parse("3 + a");