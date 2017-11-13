'use strict';

const Joi = require('joi');

const Github = require('../github');
const Logger = require('../logger');

const connection = {
    port: process.env.PORT || 3010,
    host: '0.0.0.0'
};

const routes = [
    {
        method: 'POST',
        path: '/githubPayload',
        handler: function (req, reply) {
            const user = req.payload.user;

            Github.getUserInfo(user, (data) => {
                Logger.log({
                    'data': data,
                    'level': 'info'
                });

                reply(data);
            });
        },
        config: {
            validate: {
                payload: {
                    user: Joi.string().alphanum().required()
                }
            }
        }
    }
];

module.exports = {
    connection,
    routes
};