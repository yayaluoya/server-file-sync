const getConfig = require('./sfs-v1.config');
const { startSync } = require('server-file-sync');

getConfig().then((config) => {
  startSync(config, [], true, true);
});
