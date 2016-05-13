var Promise = require('bluebird');
var path = require('path');
var fs = Promise.promisifyAll(require('fs'));
var archive = require('../helpers/archive-helpers');
var redis = require('redis');

var redisClient = redis.createClient();

exports.headers = headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  // 'Content-Type': 'text/html'
};

var isFileAsync = filePath => {
  return new Promise((resolve, reject) => {
    fs.statAsync(filePath)
      .then (data => resolve(true))
      .catch (err => resolve(false));
  });
};

isFileAsync(archive.paths.archivedSites).then(data => console.log(data));
isFileAsync('./httpadf').then(data => console.log(data));


exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  if (asset === '/') {
    asset = '/index.html';
  }

  fs.readFile(archive.paths.siteAssets + asset, (err, data) => {
    if (err) {
      console.log(err);
      fs.readFile(archive.paths.archivedSites + asset, (err, data) => {
        if ( err ) {
          callback(res, '', 404);  
        } else {
          callback(res, data);
        }
      });
      
    } else {
      callback(res, data);
    }
  });
};

exports.sendResponse = sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers); //this will by default set content type to html
  response.end(data);
};

exports.collectData = function(request, response, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    const dataSplit = data.split('=');
    callback(dataSplit[1], response);
  });
};

exports.archiveSite = (url, response) => {
  fs.readFile(`${archive.paths.archivedSites}/${url}`, (err, data) => {
    if ( err ) {
      redisClient.hset('sites', url, url, err => {
        if (err === 0) {
          console.log(err);
        } else {
          fs.readFile(archive.paths.siteAssets + '/loading.html', (err, data) => {
            sendResponse(response, data, 302);  
          });
        }
      });    
    } else {
      sendResponse(response, data, 201); 
    }
  });
};


exports.makeActionHandler = function(actionMap) {
  return function(request, response) {
    var action = actionMap[request.method];
    if (action) {
      action(request, response);
    } else {
      exports.sendResponse(response, '', 404);
    }
  };
};

// As you progress, keep thinking about what helper functions you can put here!
