const { getConfig, startSync } = require('server-file-sync');

startSync(require('./sfs.config'), [], true);
