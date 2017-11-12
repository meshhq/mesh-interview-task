'use strict';

const Hapi = require('hapi');
const ServerConfiguration = require('./server');

const server = new Hapi.Server();

server.connection(ServerConfiguration.connection);
server.route(ServerConfiguration.routes);

if (!module.parent) {
    server.start(() => {
        console.log('GithubPayload API (HapiJS) running on 3010.');
    });
}

module.exports = server;