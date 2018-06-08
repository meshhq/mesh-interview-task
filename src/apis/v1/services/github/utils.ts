// TO-DO: input validation
// TO-DO: payload input/output interfaces
// TO-DO: unit tests
export const formatGithubPayload = payload => {
  const repositories = payload.user.repositories.nodes.map(node => ({
    name: node.name,
    url: node.url,
    commitCount: node.defaultBranchRef.target.history.totalCount,
    pullRequestCount: node.pullRequests.totalCount,
  }));

  return {
    user: {
      githubHandle: payload.user.login,
      githubURL: payload.user.url,
      avatarUrl: payload.user.avatarUrl,
      email: payload.user.email,
      followerCount: payload.user.followers.totalCount,
      repositories,
    }
  };
};

export default { formatGithubPayload };
