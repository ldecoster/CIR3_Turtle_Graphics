var fs = require("fs");
var jison = require("jison");

var bnf = fs.readFileSync("test.jison", "utf8");
var parser = new jison.Parser(bnf);

parser.parse("testy 15;");