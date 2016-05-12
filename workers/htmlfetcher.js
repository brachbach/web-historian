var archiveHelpers = require('../helpers/archive-helpers');
var fs = require('fs');

archiveHelpers.readListOfUrls(data => {
  archiveHelpers.downloadUrls(data);
  fs.open(archiveHelpers.paths.list, 'w', (err, fd) => {
    fs.write(fd, '', (err) => fs.close(fd));
  });
});
// that are waiting.
