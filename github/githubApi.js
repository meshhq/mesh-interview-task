'use strict';

const GitHubApi = require('github');
const BbPromise = require('bluebird');

const oAuthSettings = require('./authconfig');

const github = new GitHubApi({
    debug: false,
    protocol: 'https',
    host: 'api.github.com',
    headers: {
        'user-agent': 'mesh-demo' // GitHub is happy with a unique user agent
    },
    Promise: BbPromise,
    followRedirects: false,
    timeout: 5000
});

github.authenticate(oAuthSettings);

module.exports = {
    getUser: github.users.getForUser,
    getRepos: github.repos.getForUser,
    getCommits: github.repos.getCommits,
    getPullRequests: github.pullRequests.getAll
};