'use strict';

const errorMessage = 'Github 0Auth credentials missing!';

let oAuthSettings = null;
switch (process.env.GITHUB_ACCESS_TYPE) {
    case 'TOKEN':
        if (!process.env.GITHUB_USER_TOKEN) {
            throw new Error(errorMessage);
        }

        oAuthSettings = {
            type: 'token',
            token: process.env.GITHUB_USER_TOKEN
        };
        break;

    case 'OAUTH':
        if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
            throw new Error(errorMessage);
        }

        oAuthSettings = {
            type: 'oauth',
            key: process.env.GITHUB_CLIENT_ID,
            secret: process.env.GITHUB_CLIENT_SECRET
        };
        break;

    default:
        break;
}

module.exports = oAuthSettings;

