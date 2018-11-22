var express = require('express');
var bodyParser = require("body-parser");
 
// serveur html
var server = express();
server.use(bodyParser.urlencoded({ extended: true }));
server.listen(8080);
 
server.get('/page.html', function(request, response) {
  response.sendFile( __dirname  + '/page.html');
});
 
server.post('/page.html', function(request, response) {
  var p1 = request.body.p1; 
  console.log("p1=" + p1);
  response.sendFile( __dirname  + '/page.html');
});