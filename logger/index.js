var Logger = require('logzio-nodejs');

module.exports = Logger.createLogger({
    token: process.env.LOG_TOKEN,
    host: 'listener.logz.io',
    type: 'github-server'     // OPTIONAL (If none is set, it will be 'nodejs')
});

