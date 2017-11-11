const co = require('co');
const internal = require('./internal');

module.exports = {
    getUserInfo(username, cb) {
        co(function* () {
            var user = internal.getUser(username);
            var repos = internal.getRepos(username);
            var followers = internal.getFollowers(username);
            var initialData = yield { followers, user, repos };

            var yeilded = [];
            initialData.repos.forEach((r) => {
                yeilded.push({
                    name: r.name,
                    url: r.url,
                    pullRequest: internal.getPullRequests(username, r.name),
                    commits: internal.getCommits(username, r.name)
                });
            });

            var result = yield yeilded;
            return internal.cleanResult({
                user: initialData.user,
                followers: initialData.followers,
                repositories: result
            });
        }).then(cb);
    }
};
