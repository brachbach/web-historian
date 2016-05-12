var http = require('http');
var handler = require('./request-handler');
var initialize = require('./initialize.js');
var url = require('url');
require('../workers/htmlfetcher.js');


// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize('./archives');

var port = 8080;
var ip = '127.0.0.1';


const server = http.createServer(function(req, res) {
  console.log(`URL: ${req.url} METHOD: ${req.method}`);
  handler.handleRootRequest(req, res);
});

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log('Listening on http://' + ip + ':' + port);
}

