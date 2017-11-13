const chai = require('chai');
const expect = chai.expect;

const Server = require('../index.js');

describe('GithubApi', () => {
    describe('/POST githubPayload', function () {
        it('it should RETRIEVE user information', function (done) {
            this.timeout(8000);

            Server.inject({
                method: 'POST',
                url: '/githubPayload',
                payload: {
                    user: 'LeonardoJPerez'
                }
            }, res => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.payload).to.not.be.null;

                const payload = JSON.parse(res.payload);
                expect(payload.user.githubHandle).to.equal('LeonardoJPerez');
                expect(payload.user.email).to.equal('find.leonardo@gmail.com');
                expect(payload.user.followerCount).to.equal(1);

                done();
            });
        });
    });
});