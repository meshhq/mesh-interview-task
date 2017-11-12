'use strict';

const Github = require('../github');

const connection = {
    port: 3010,
    host: 'localhost'
};

const routes = [
    {
        method: 'POST',
        path: '/githubPayload',
        handler: function (req, reply) {
            const user = req.payload.user; // add selectn
            Github.getUserInfo(user, (data) => {
                reply(data);
            });
        }
    }
];

module.exports = {
    connection,
    routes
};