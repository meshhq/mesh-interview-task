'use strict';
const graphqlGot = require('graphql-got');

const endpoint = 'https://api.github.com/graphql';
const query = `
	query githubPayload($username: String!) {
		user(login: $username) {
			login
			url
			avatarUrl
			email
			followers {
				totalCount
			}
			repositories(first: 100) {
				nodes {
					name
					url
					defaultBranchRef {
						target {
							...on Commit {
								history {
									totalCount
								}
							}
						}
					}
					pullRequests {
						totalCount
					}
				}
			}
		}
	}
`;

async function fetchUserData(username, token) {
	try {
		if (!username) {
			throw new Error('Please specify a GitHub username');
		}

		if (!token) {
			throw new Error('Please specify a GitHub token');
		}

		const {body} = await graphqlGot(endpoint, {
			query,
			token,
			variables: {
				username
			}
		});

		if (!body.user) {
			throw new Error('User not found');
		}

		const {
			login: githubHandle,
			url: githubURL,
			avatarUrl: avatarURL,
			email,
			followers: {
				totalCount: followerCount
			},
			repositories: {
				nodes: repositories
			}
		} = body.user;

		const repos = repositories.map(repo => ({
			name: repo.name,
			url: repo.url,
			commitCount: repo.defaultBranchRef.target.history.totalCount,
			pullRequestCount: repo.pullRequests.totalCount
		}));

		return {
			user: {
				githubHandle,
				githubURL,
				avatarURL,
				email,
				followerCount,
				repositories: repos
			}
		};

	} catch (error) {
		const errors = [];

		if (error.constructor.name === 'AggregateError') {
			for (const err of error) {
				errors.push({
					name: err.name,
					message: err.message
				});
			}

		} else {
			errors.push({
				name: error.name,
				message: error.message
			});
		}

		return errors;
	}
}

module.exports = async (username, token) => {
	const response = await fetchUserData(username, token);

	return response;
};
