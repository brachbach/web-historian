var promise = require('bluebird');
var fs = promise.promisifyAll(require('fs'));
var path = require('path');
var _ = require('underscore');
var request = require('request');
var redis = require('redis');

var redisClient = redis.createClient();

var requestPromise = (url) => {
  return new promise((resolve, reject) => {  
    request(url, (err, response, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

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
  fs.readFileAsync(paths.list)
    .then (data => data.toString().split('\n'))
    .then (data => data[data.length - 1] === '' ? data.slice(0, -1) : data)
    .then (data => callback(null, data));
};

exports.readListOfUrls = readListOfUrls = function(callback) {
  redisClient.hkeys('sites', (err, replies) => callback (null, replies));
};

exports.isUrlInList = isUrlInList = function(target, callback) {
  readListOfUrls((err, data) => {
    callback(err, data.indexOf(target) > -1);
  });
};

exports.addUrlToList = addUrlToList = function(url, callback) {
  fs.appendFile(paths.list, url, callback);
};

exports.isUrlArchived = isUrlArchived = function(url, callback) {
  fs.stat(`${paths.archivedSites}/${url}`, err => callback(null, err ? false : true));
};

exports.downloadUrls = downloadUrls = function(urlArray, callback) {
  urlArray.forEach( url => {
    requestPromise(`http://${url}`)
      .then(data => fs.appendFileAsync(`${paths.archivedSites}/${url}`, data))
      .then(data => callback(null, data));
  });
};
exports.readListOfUrlsAsync = promise.promisify(readListOfUrls);
exports.isUrlInListAsync = promise.promisify(isUrlInList);
exports.addUrlToListAsync = promise.promisify(addUrlToList);
exports.isUrlArchivedAsync = promise.promisify(isUrlArchived);
exports.downloadUrlsAsync = promise.promisify(downloadUrls);
