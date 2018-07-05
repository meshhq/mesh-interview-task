#!/usr/bin/env node
'use strict';
const meow = require('meow');
const githubPayload = require('.');

const cli = meow(`
	Usage
	  $ githubPayload [username] --token [token]

	Options
	  --token, -t  GitHub token

	Examples
	  $ githubPayload awcross --token 3c970dc41e393f04295193b2339ca7c3c56290fa
	  {
		"user": {
		  "githubHandle": "awcross",
		  "githubURL": "https://github.com/awcross",
		  ...
	    }
	  }
`, {
	flags: {
		token: {
			type: 'string',
			alias: 't',
			default: ''
		}
	}
});

const {input} = cli;

if (input.length === 0) {
	console.error('Please specify a GitHub username');
	process.exit(1);
}

const {token} = cli.flags;

if (token.length === 0) {
	console.error('Please specify a GitHub token');
	process.exit(1);
}

githubPayload(input[0], token).then(res => console.log(JSON.stringify(res, null, 2)));
