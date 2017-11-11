const GithubApi = require('../github');

module.exports = [
    {
        method: "POST",
        path: "/githubPayload",
        handler: function (req, reply) {
            const user = req.payload.user; // add selectn
            GithubApi.getUserInfo(user, (data) => {
                reply(data);
            });
        }
    }
]