import axios from 'axios';

// TO-DO: resolve this with webpack
const { github: { apiUrl, token }} = require.main.require('../config.json');

export const templates = {
  // ...,
  githubPayload: (login: string) => `
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
  `,
  // ...
};

// a simple request wrapper
export const query = (query: string) => axios.post(apiUrl, JSON.stringify({ query }), {
  headers: { 'Authorization': `bearer ${token}` },
});

export default { query, templates };
