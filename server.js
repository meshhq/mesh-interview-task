'use strict';
const fs = require('fs');
const polka = require('polka');
const github = require('.');

const configPath = './config.json';

if (!fs.existsSync(configPath)) {
	throw new Error('The file `config.json` is missing');
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const {username, token} = config;

const app = polka();

app.get('/githubPayload/:username?', async (request, response) => {
	let handle = request.params.username;

	if (!handle) {
		handle = username;
	}

	const data = await github(handle, token);

	response.end(JSON.stringify(data, null, 4));
});

app.listen(3000).then(() => {
	console.log('> Running on localhost:3000');
});
