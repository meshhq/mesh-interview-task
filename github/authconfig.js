

let oAuthSettings = null;
swtich(process.env.GITHUB_ACCESS_TYPE){
    case 'TOKEN':
        if (!process.env.GITHUB_USER_TOKEN) {
            throw new Error('Github 0Auth credetials missing!');
        }
        oAuthSettings = {
            type: 'token',
            token: process.env.GITHUB_USER_TOKEN // '56361fa56e57f5d6a813b58e07845409b60ed3db'
        }
    break;

    case 'OAUTH':
        if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
            throw new Error('Github OAuth credentials missing!');
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

