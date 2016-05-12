var promise = require('bluebird');
var archiveHelpers = require('../helpers/archive-helpers');
var fs = promise.promisifyAll(require('fs'));
var CronJob = require('cron').CronJob;

new CronJob('*/10 * * * * *', function() {
  archiveHelpers.readListOfUrlsAsync()
    .then( data => archiveHelpers.downloadUrlsAsync(data))
    .then( fd => fs.writeFileAsync(archiveHelpers.paths.list, ''));
}, null, true, 'America/Los_Angeles');