const GitHubApi = require('github');
const BbPromise = require('bluebird');
const co = require('co');

const github = new GitHubApi({
    debug: false,
    protocol: 'https',
    host: 'api.github.com',
    //pathPrefix: '/api/v3', // for some GHEs; none for GitHub
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

github.authenticate(oAuthSettings);

const getUser = (username) => {
    return new Promise((resolve, reject) => {
        github.users.getForUser({
            username
        }, (err, res) => {
            if (err) {
                reject('');
            }

            resolve(res.data);
        });
    });
}

const getRepos = (username) => {
    return new Promise((resolve, reject) => {
        github.repos.getForUser({
            username,
            affiliation: 'owner',
            sort: 'full_name'
        }, (err, res) => {
            if (err) {
                reject('');
            }

            resolve(res.data);
        });
    });
}

const getCommits = (owner, repositoryName) => {
    return new Promise((resolve, reject) => {
        github.repos.getCommits({
            owner,
            repo: repositoryName,
            path: ''
        }, (err, res) => {
            if (err) {
                reject('');
            }

            resolve(res.data);
        });
    })
}

const getPullRequests = (owner, repositoryName, state = 'all') => {
    return new Promise((resolve, reject) => {
        github.pullRequests.getAll({
            owner,
            repo: repositoryName,
            state //"open"|"closed"|"all";
        }, (err, res) => {
            if (err) {
                console.log(err);
                reject('');
            }

            console.log(res.data);
            resolve(res.data);
        });
    })
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
            return {
                user,
                repositories: result
            }
        }).then((data) => {
            cb(data);
        })
    }
};
