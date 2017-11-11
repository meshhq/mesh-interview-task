const GitHubApi = require('github');
const BbPromise = require('bluebird');

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
    key: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET
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
};

module.exports = {
    getUser: (username) => {
        return getPromise(github.users.getForUser, {
            username
        });
    },

    getFollowers: (username) => {
        return getPromise(github.users.getFollowersForUser, {
            username
        });
    },

    getRepos: (username) => {
        return getPromise(github.repos.getForUser, {
            username,
            affiliation: 'owner',
            sort: 'full_name'
        });
    },

    getCommits: (owner, repositoryName) => {
        return getPromise(github.repos.getCommits, {
            owner,
            repo: repositoryName,
            path: ''
        });
    },

    getPullRequests: (owner, repositoryName, state = 'all') => {
        return getPromise(github.pullRequests.getAll, {
            owner,
            repo: repositoryName,
            state //"open"|"closed"|"all";
        });
    },
    cleanResult: (data) => {
        return {
            user: {
                githubHandle: data.user.login,
                githubURL: data.user.url,
                avatarURL: data.user.avatar_url,
                email: data.user.email,
                followerCount: data.followers.length,
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
}