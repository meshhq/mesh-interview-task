'use strict';

const Co = require('co');
const githubApi = require('./githubApi');
const Internal = require('./internal')(githubApi);

module.exports = {

    getUserInfo(username, cb) {

        Co(function* () {
            const user = Internal.getUser(username);
            const repos = Internal.getRepos(username);

            let initialData
            try {
                initialData = yield { user, repos };
            } catch (error) {
                // log error.
                return {
                    message: error.message
                }
            }

            const yeilded = [];
            initialData.repos.forEach((r) => {
                yeilded.push({
                    name: r.name,
                    url: r.url,
                    pullRequest: Internal.getPullRequests(username, r.name),
                    commits: Internal.getCommits(username, r.name)
                });
            });

            const result = yield yeilded;
            return Internal.transformResult({
                user: initialData.user,
                repositories: result
            });
        }).then(cb, function (err) {
            console.error(err.stack);
        });
    }
};
