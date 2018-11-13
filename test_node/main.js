var fs = require("fs");
var jison = require("jison");

var bnf = fs.readFileSync("calculator.jison", "utf8");
var parser = new jison.Parser(bnf);

var end = parser.parse("1 + 1");
console.log(" return of parser : " + end);
