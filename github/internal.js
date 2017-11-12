'use strict';
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

const getErrorPromise = (error) => {
    return Promise.resolve(error);
}

module.exports = function (api) {
    return {
        getUser: (username = '') => {
            if (!username) {
                return getErrorPromise({ error: 'Username is missing.' });
            }

            return getPromise(api.getUser, {
                username
            });
        },

        getFollowers: (username = '') => {
            if (!username) {
                return getErrorPromise({ error: 'Username is missing.' });
            }

            return getPromise(api.getFollowers, {
                username
            });
        },

        getRepos: (username = '') => {
            if (!username) {
                return getErrorPromise({ error: 'Username is missing.' });
            }

            return getPromise(api.getRepos, {
                username,
                affiliation: 'owner',
                sort: 'full_name'
            });
        },

        getCommits: (owner = '', repositoryName = '') => {
            if (!owner || !repositoryName) {
                return getErrorPromise({ error: 'Owner or Repository name is missing.' });
            }

            return getPromise(api.getCommits, {
                owner,
                repo: repositoryName,
                path: ''
            });
        },

        getPullRequests: (owner = '', repositoryName = '', state = 'all') => {
            if (!owner || !repositoryName) {
                return getErrorPromise({ error: 'Owner or Repository name is missing.' });
            }

            return getPromise(api.getPullRequests, {
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
                        };
                    })
                }
            };
        }
    };
};