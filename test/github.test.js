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
                pullRequestCount: 10
            },
            {
                name: "HandyTools",
                url: "https://api.github.com/repos/LeonardoJPerez/HandyTools",
                commitCount: 30,
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
            }),
            getRepos: sinon.stub().callsFake(function (o, cb) {
                cb(null, { data: { repositories: testData.user.repositories } });
            }),
            getCommits: sinon.stub().callsFake(function (o, cb) {
                cb(null, {
                    data: {
                        name: testData.user.repositories[2].name,
                        commitCount: testData.user.repositories[2].commitCount
                    }
                });
            }),
            getPullRequests: sinon.stub().callsFake(function (o, cb) {
                cb(null, {
                    data: {
                        name: testData.user.repositories[1].name,
                        pullRequestCount: testData.user.repositories[1].pullRequestCount
                    }
                });
            })
        });
    });

    describe('getUser function', () => {
        it('it should get user information based on a given Github username', function (done) {
            var result = Internal
                .getUser(testData.user.githubHandle)
                .then(res => {
                    expect(res.githubHandle).to.equal(testData.user.githubHandle);
                    done();
                });
        });

        it('it should return Error object when no username is provided', function (done) {
            var result = Internal
                .getUser('')
                .then(res => {
                    expect(res.error).to.equal("Username is missing.");
                    done();
                });
        });
    });

    describe('getRepos function', () => {
        it('it should get a user\'s repository collection by a Github username', function (done) {
            var result = Internal
                .getRepos(testData.user.githubHandle)
                .then(res => {
                    expect(res.repositories).to.be.an('array');
                    expect(res.repositories.length).to.equal(testData.user.repositories.length);

                    done();
                });
        });

        it('it should return Error object when no username is provided', function (done) {
            var result = Internal
                .getRepos('')
                .then(res => {
                    expect(res.error).to.equal("Username is missing.");

                    done();
                });
        });
    });

    describe('getCommits function', () => {
        it('it should get repository\'s commit count by a Github owner and a repository name', function (done) {
            var result = Internal
                .getCommits(testData.user.githubHandle, testData.user.repositories[2].name)
                .then(res => {
                    expect(res).to.be.an('object');
                    expect(res.name).to.equal(testData.user.repositories[2].name);
                    expect(res.commitCount).to.equal(testData.user.repositories[2].commitCount);

                    done();
                });
        });

        it('it should return Error object when no username is provided', function (done) {
            var result = Internal
                .getCommits()
                .then(res => {
                    expect(res.error).to.equal("Owner or Repository name is missing.");

                    done();
                });
        });
    });

    describe('getPullRequests function', () => {
        it('it should get repository\'s pull request count by a Github owner and a repository name', function (done) {
            var result = Internal
                .getPullRequests(testData.user.githubHandle, testData.user.repositories[1].name)
                .then(res => {
                    expect(res).to.be.an('object');
                    expect(res.name).to.equal(testData.user.repositories[1].name);
                    expect(res.pullRequestCount).to.equal(testData.user.repositories[1].pullRequestCount);

                    done();
                });
        });

        it('it should return Error object when no username is provided', function (done) {
            var result = Internal
                .getPullRequests()
                .then(res => {
                    expect(res.error).to.equal("Owner or Repository name is missing.");

                    done();
                });
        });
    });

    describe('cleanResult function', () => {
        it('it should return a user object when provided raw data.', function (done) {
            var result = Internal
                .cleanResult({
                    user: {
                        login: testData.user.githubHandle,
                        url: testData.user.githubURL,
                        avatar_url: testData.user.avatarURL,
                        email: testData.user.email,
                        followers: testData.user.followerCount,
                    },
                    repositories: [{
                        name: testData.user.repositories[0].name,
                        url: testData.user.repositories[0].url,
                        commits: [{}, {}, {}],
                        pullRequest: [{}, {}]
                    }]
                });

            expect(result).to.be.an('object');
            expect(result.user.githubHandle).to.equal(testData.user.githubHandle);
            expect(result.user.avatar_url).to.equal(testData.user.avatar_url);
            expect(result.user.email).to.equal(testData.user.email);
            expect(result.user.repositories.length).to.equal(1);

            done();

        });

        it('it should return Error object when no username is provided', function (done) {
            var result = Internal
                .getPullRequests()
                .then(res => {
                    expect(res.error).to.equal("Owner or Repository name is missing.");

                    done();
                });
        });
    });
});