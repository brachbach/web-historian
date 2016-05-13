var promise = require('bluebird');
var archiveHelpers = require('../helpers/archive-helpers');
var fs = promise.promisifyAll(require('fs'));
var CronJob = require('cron').CronJob;
var redis = require('redis');

var redisClient = redis.createClient();

new CronJob('*/10 * * * * *', function() {
  archiveHelpers.readListOfUrlsAsync()
    .then( data => archiveHelpers.downloadUrlsAsync(data))
    .then( redisClient.flushall() );
}, null, true, 'America/Los_Angeles');