var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require ('./http-helpers.js');
// require more modules/folders here!

exports.handleRootRequest = httpHelpers.makeActionHandler(
  {
    GET: function(req, res) {
      httpHelpers.serveAssets(res, req.url, httpHelpers.sendResponse); 
    },
    POST: function(req, res) {
      httpHelpers.collectData(req, res, (data, response) => httpHelpers.archiveSite(data, response));
    }
  }
);

