'use strict';

const Hapi = require('hapi');
const ServerConfiguration = require('./server');

const server = new Hapi.Server();

server.connection(ServerConfiguration.connection);
server.route(ServerConfiguration.routes);

if (!module.parent) {
    server.start(() => {
        // eslint-disable-next-line no-console
        console.log(`GithubPayload API (HapiJS) running on ${ServerConfiguration.connection.port}.`);
    });
}

module.exports = server;