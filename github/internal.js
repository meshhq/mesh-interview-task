'use strict';

const Logger = require('../logger');
const State = require('./enumTypes').PullRequestState;

/**
 * Wraps the supplied function within a Promise.
 * @param {function} func - The function to be wrapped.
 * @param {object} arg - The arguments to call the func with.
 * @returns {Promise}
 */
const getPromise = (func, arg) => {
    return new Promise((resolve, reject) => {
        func(arg, (err, res) => {
            if (err) {
                Logger.log({
                    'error': err,
                    'level': 'error'
                });

                reject({ message: JSON.parse(err.message).message });

                return;
            }

            resolve(res.data);
        });
    });
};

/**
 * Return a Promise with an error.
 * @constructor
 * @param {string} error - The message to attach to the Error object.
 * @returns {Promise}
 */
const getErrorPromise = (error) => {
    return Promise.resolve(error);
}

module.exports = function (api) {
    return {

        /**
        * Returns an User object from GitHub RESTful (V3) API.
        * @constructor
        * @param {string} username - The github username to retrieve.        
        * @returns {Promise} - Promisified result.
        */
        getUser: (username = '') => {
            if (!username) {
                return getErrorPromise({ error: 'Username is missing.' });
            }

            return getPromise(api.getUser, {
                username
            });
        },

        /**
        * Returns a promisified collection of Repositories object from GitHub RESTful (V3) API.
        * @constructor
        * @param {string} username - The github username to retrieve.        
        * @returns {Promise} - Promisified result
        */
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

        /**
        * Returns a promisified collection of Commits from GitHub RESTful (V3) API.
        * @constructor
        * @param {string} owner - The github username to retrieve.     
        * @param {string} repositoryName - The github repository name owned by owner. 
        * @returns {Promise} - Promisified result
        */
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

        /**
        * Returns a promisified collection of Commits from GitHub RESTful (V3) API.
        * @constructor
        * @param {string} owner - The github username to retrieve.     
        * @param {string} repositoryName - The github repository name owned by owner. 
        * @param {string} state - Pull request state. ["all"|"open"|"closed"]
        * @returns {Promise} - Promisified result
        */
        getPullRequests: (owner = '', repositoryName = '', state = State.ALL) => {
            if (!owner || !repositoryName) {
                return getErrorPromise({ error: 'Owner or Repository name is missing.' });
            }

            if (![State.ALL, State.CLOSED, State.OPEN].includes(state.toLowerCase())) {
                return getErrorPromise({ error: 'State is not valid value. ' + State });
            }

            return getPromise(api.getPullRequests, {
                owner,
                repo: repositoryName,
                state
            });
        },

        /**
        * Returns a transformed object from input data.
        * @constructor
        * @param {object} data - The github username to retrieve.            
        * @returns {object} - Transformed result
        */
        transformResult: (data) => {
            if (!data) { return {}; }

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
                        };
                    })
                }
            };
        }
    };
};