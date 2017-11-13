const Logger = require('logzio-nodejs');

let _logger = {};
if (process.env.LOG_TOKEN) {
    _logger.createLogger({
        token: process.env.LOG_TOKEN,
        host: 'listener.logz.io',
        type: 'github-server'     // OPTIONAL (If none is set, it will be 'nodejs')
    });
}

module.exports = {
    log: function (data) {
        if (process.env.NODE_ENV === 'dev') {
            return;
        }

        _logger.log(
            Object.assign({}, data, {
                '@timestamp': new Date()
            })
        );
    }
};

