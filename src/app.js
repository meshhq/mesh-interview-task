// TO-DO: typescript, mocha/chai (unit tests)
// TO-DO: if graphql is suitable for our own application, we might
// get away with simply exposing an authenticated github root field
// and let clients query github's graphql api "directly"
const express = require('express');
const axios = require('axios');

const config = require('../config.json');

// for brevity and ease of review, i will define everything here
// but i will include a path to where things would/should be defined/located

// src/services/github/common?
// this is a query template that generates the necessary graphql query
// TO-DO: define common query fragments?
// TO-DO: better repository pagination (for now we'll just assume nobody has more than 100 repos)
const userPayloadQuery = login => `
  query {
    user(login: "${login}") {
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

// src/services/github/util?
// now that we can generate the necessary query we'll create a wrapper that issues it
const github = query => axios.post(config.github.apiUrl, JSON.stringify({ query }), {
  headers: { 'Authorization': `bearer ${config.github.token}` },
});

// src/services/github/util
// the graphql response has everything we need, but not in the desired format
// this util will format the graphql response
const formatGithubUserPayload = ({ user }) => {
  const { login: githubHandle, url: githubURL, followers: { totalCount: followerCount }, repositories: { nodes }, ...rest } = user;
  const repositories = nodes.map(({ name, url, pullRequests, defaultBranchRef }) => ({
    name,
    url,
    // we could just destructure these, but it gets a bit long-winded
    commitCount: defaultBranchRef.target.history.totalCount,
    pullRequestCount: pullRequests.totalCount,
  }));
  return { user: { githubHandle, githubURL, ...rest, followerCount, repositories }};
};

// ---- //
const app = express();

// i was unsure if we pass a user login or if it is this app's user (i.e. from the session)
// so for brevity we will just define a simple handler that can accomodate both
// if our application communicates with github regularly, we'd want
// to simply expose a more fleshed-out utility wrapper
// src/routes/github?
const userPayloadHandler = async (req, res) => {
  // we don't have real session data, so let's cheat and grab it from config...
  const { login = config.github.login } = req.params;
  try {
    const { data: { data, errors }} = await github(userPayloadQuery(login));
    if (data) return res.json(formatGithubUserPayload(data));
    return res.json(errors); // TO-DO: format and forward github errors more appropriately
  } catch (e) {} // TO-DO: create appropriate failure response
}

// finally, a couple routes (normally in src/routes/~)
app.get('/githubPayload', userPayloadHandler);
app.get('/githubPayload/:login', userPayloadHandler);

app.listen('8000', () => console.log('listening...'));
