import github from './github';
import { formatGithubPayload } from './utils';

// TO-DO: resolve this with webpack
const config = require.main.require('../config.json');

// TO-DO: unit tests
export const githubPayload = async (req, res) => {
  // we don't have real session data, so we'll simulate it from the config
  const { login = config.github.login } = req.params;
  try {
    const { data: { data, errors }} = await github.query(github.templates.githubPayload(login));
    if (data) return res.json(formatGithubPayload(data));
    return res.json(errors); // TO-DO: format and forward github errors more appropriately
  } catch (e) {} // TO-DO: create appropriate failure response
};

export default { githubPayload };
