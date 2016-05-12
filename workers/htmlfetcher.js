var archiveHelpers = require('../helpers/archive-helpers');
var fs = require('fs');
var CronJob = require('cron').CronJob;
// that are waiting.

new CronJob('*/30 * * * * *', function() {
  archiveHelpers.readListOfUrls(data => {
    archiveHelpers.downloadUrls(data);
    fs.open(archiveHelpers.paths.list, 'w', (err, fd) => {
      fs.write(fd, '', (err) => fs.close(fd));
    });
  });
}, null, true, 'America/Los_Angeles');