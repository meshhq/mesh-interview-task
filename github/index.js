'use strict';

const Co = require('co');
const githubApi = require('./githubApi');
const Internal = require('./internal')(githubApi);

module.exports = {

    getUserInfo(username, cb) {

        Co(function* () {
            const user = Internal.getUser(username);
            const repos = Internal.getRepos(username);
            const followers = Internal.getFollowers(username);
            const initialData = yield { followers, user, repos };

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
            return Internal.cleanResult({
                user: initialData.user,
                followers: initialData.followers,
                repositories: result
            });
        }).then(cb);
    }
};
