var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = readListOfUrls = function(callback) {
  fs.readFile(paths.list, (err, data) => callback(data.toString().split('\n')));
};

exports.isUrlInList = function(target, callback) {
  callback(readListOfUrls(data => data.indexOf(target) > -1));
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(paths.list, url, callback);
};

exports.isUrlArchived = function(url, callback) {
  fs.stat(`${paths.archivedSites}/${url}`, err => callback(err ? false : true));
};

exports.downloadUrls = function(urlArray) {
  urlArray.forEach( url => fs.open(`${paths.archivedSites}/${url}`,'w', err => err && console.log(err)));
};
