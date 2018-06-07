# API

```...```

### /githubPayload
Returns a synopsis of user's GitHub profile in the following format:
```
{
  user: {
    githubHandle:
    githubURL:
    avatarURL:
    email:
    followerCount:
    repositories: [
      {
        name:
        url:
        commitCount:
        pullRequestCount:
      },
      {...}
    ]
  }
}
```

### /githubPayload/:username
Returns a synopsis of a specific user's GitHub profile (see /githubPayload)

```...```
