import test from 'ava';
import nock from 'nock';
import got from 'got';
import polka from 'polka';
import githubResponse from './github-response';
import fixture from './fixture';
import m from '..';

const port = 3000;
const url = `http://localhost:${port}/`;

test.before('setup', async () => {
	const username = 'awcross';
	const token = 'batman';

	const reply = {
		data: githubResponse
	};

	nock('https://api.github.com/graphql')
		.filteringPath(pth => `${pth}/`)
		.matchHeader('authorization', `bearer ${token}`)
		.post('/')
		.reply(200, reply);

	const app = polka();

	app.get('/', async (request, response) => {
		const data = await m(username, token);
		response.end(JSON.stringify(data));
	});

	app.listen(port);
});

test('fetch user data', async t => {
	const {body} = await got(url, {json: true});

	t.deepEqual(body, fixture);

	if (body.user) {
		t.is(body.user.githubHandle, 'awcross');
		t.is(typeof body.user.followerCount, 'number');
		t.true(Array.isArray(body.user.repositories));
	}
});
