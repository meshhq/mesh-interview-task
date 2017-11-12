const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const testData = {
    user: {
        githubHandle: "LeonardoJPerez",
        githubURL: "https://api.github.com/users/LeonardoJPerez",
        avatarURL: "https://avatars0.githubusercontent.com/u/595741?v=4",
        email: "find.leonardo@gmail.com",
        followerCount: 1,
        repositories: [
            {
                name: "AchieveIT.Test",
                url: "https://api.github.com/repos/LeonardoJPerez/AchieveIT.Test",
                commitCount: 30,
                pullRequestCount: 0
            },
            {
                name: "amazon-kinesis-client-nodejs",
                url: "https://api.github.com/repos/LeonardoJPerez/amazon-kinesis-client-nodejs",
                commitCount: 8,
                pullRequestCount: 0
            },
            {
                name: "AzureWorkerRoleDemo",
                url: "https://api.github.com/repos/LeonardoJPerez/AzureWorkerRoleDemo",
                commitCount: 3,
                pullRequestCount: 0
            }]
    }
};

describe('GithubApi Internals', () => {
    let Internal;

    before(function () {
        Internal = require('../github/internal')({
            getUser: sinon.stub().callsFake(function (o, cb) {
                cb(null, { data: { githubHandle: testData.user.githubHandle } });
            })
        });
    });

    describe('getUser function', () => {
        it('it should get user information based on a given Github user', function (done) {
            var result = Internal
                .getUser(testData.user.githubHandle)
                .then(res => {
                    expect(res.githubHandle).to.equal(testData.user.githubHandle);
                    done();
                });
        });

        it('it should return Error object when no user is provided', function (done) {
            var result = Internal
                .getUser('')
                .then(res => {
                    expect(res.error).to.equal("Username is missing.");
                    done();
                });
        });
    });
});

    // describe getFollowers: (username)

    // describe getRepos: (username)

    // describe getCommits: (owner, repositoryName) 

    // describe getPullRequests: (owner, repositoryName, state = 'all')

    // describe cleanResult: (data)
