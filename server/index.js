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
        method: 'GET',
        path: '/githubPayload/{user}',
        handler: function (req, reply) {
            const user = req.params.user;

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
                params: {
                    user: Joi.string().alphanum().min(3).required()
                }
            }
        }
    }
];

module.exports = {
    connection,
    routes
};