const GitHubApi = require('github');
const BbPromise = require('bluebird');
const co = require('co');
const _ = require('lodash');

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

const oAuthSettings = {
    type: 'token',
    token: '56361fa56e57f5d6a813b58e07845409b60ed3db'
};

const oAuthSettings1 = {
    type: 'oauth',
    key: process.env.GITHUB_CLIENT_ID, // Iv1.5eaad8533db72d3b
    secret: process.env.GITHUB_CLIENT_SECRET //41c7ed21d44caa52d215367f7401090f1f0336e6
};

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    throw new Error('Github 0Auth credetials missing!');
}

github.authenticate(oAuthSettings);

const getPromise = (func, arg) => {
    return new Promise((resolve, reject) => {
        func(arg, (err, res) => {
            if (err) {
                console.log(err);
                reject('');

                return;
            }
            resolve(res.data);
        });
    });
}

const getUser = (username) => {
    return getPromise(github.users.getForUser, {
        username
    });
}

const getRepos = (username) => {
    return getPromise(github.repos.getForUser, {
        username,
        affiliation: 'owner',
        sort: 'full_name'
    });
}

const getCommits = (owner, repositoryName) => {
    return getPromise(github.repos.getCommits, {
        owner,
        repo: repositoryName,
        path: ''
    });
}

const getPullRequests = (owner, repositoryName, state = 'all') => {
    return getPromise(github.pullRequests.getAll, {
        owner,
        repo: repositoryName,
        state //"open"|"closed"|"all";
    });
}

const cleanResult = (data) => {
    return {
        user: {
            githubHandle: data.user.login,
            githubURL: data.user.url,
            avatarURL: data.user.avatar_url,
            email: data.user.email,
            followerCount: data.user.followers,
            repositories: data.repositories.map((el) => {
                return {
                    name: el.name,
                    url: el.url,
                    commitCount: el.commits.length,
                    pullRequestCount: el.pullRequest.length
                }
            })
        }
    }
}

module.exports = {
    getUserInfo(username, cb) {
        co(function* () {
            var user = getUser(username);
            var repos = getRepos(username);
            var initialData = yield { user, repos };

            var yeilded = [];
            initialData.repos.forEach((r) => {
                yeilded.push({
                    name: r.name,
                    url: r.url,
                    pullRequest: getPullRequests(username, r.name),
                    commits: getCommits(username, r.name)
                });
            });

            var result = yield yeilded;
            return cleanResult({
                user: initialData.user,
                repositories: result
            });

            // Count commits and Pull requests.
        }).then(cb);
    }
};
