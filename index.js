const Hapi = require("hapi");
const GithubApi = require('./github');
const ServerConfiguration = require('./server');

const server = new Hapi.Server();

server.connection(ServerConfiguration.connection);
server.route(ServerConfiguration.routes);

server.start(function () {
    console.log("GithubPayload API (HapiJS) running on 3010.");
});