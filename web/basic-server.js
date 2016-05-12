var http = require('http');
var handler = require('./request-handler');
var initialize = require('./initialize.js');
var url = require('url');

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize('./archives');

var port = 8080;
var ip = '127.0.0.1';

var router = {
  // '/'
};

const server = http.createServer(function(req, res) {
  console.log(`URL: ${req.url} METHOD: ${req.method}`);
  // console.log(url.parse(req.url).pathname);
  const route = router[url.parse(req.url).pathname];
  // console.log('route:', route);
  if (route) {
    route(req, res);
  } else {
    handler.handleRootRequest(req, res);
  }
});



if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log('Listening on http://' + ip + ':' + port);
}

