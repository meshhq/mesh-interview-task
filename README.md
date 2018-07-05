# Mesh Interview Task

The Mesh interview task is to write a simple HTTP server that is integrated with the GitHub API. It can be written in whatever language you are most comfortable with. You can find all GitHub documentation at the following URL.

https://developer.github.com/


## Run

Built using [polka](https://github.com/lukeed/polka).

First, locate and rename `config-sample.json` to `config.json`, then edit the file and add your GitHub username and GitHub token.


```
$ npm install && npm start
```


## CLI

This is an example CLI that could be used if installed. Can be ran using `npx . [username] -t [token]`.

```
$ githubPayload --help

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
```


## License

MIT © [Alex Cross](https://alexcross.io)
