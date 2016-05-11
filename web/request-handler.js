var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('../helpers/utils');
var httpHelpers = require ('./http-helpers.js');
// require more modules/folders here!

exports.handleRootRequest = utils.makeActionHandler(
  {
    GET: function(req, res) {
      httpHelpers.serveAssets(res, req.url, httpHelpers.sendResponse); //should add getting asset name from the request url
    }
  }
);

