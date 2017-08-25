# Mesh Interview Task

The Mesh interview task is to write a simple server that is integrated with the Github API. It can be written in whatever language you are most comfortable with.

The server should expose a single API that returns a user payload containing information about your personal Github account. The payload should look like the following:

```
GET /githubPayload

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

The server should not contain any hard coded information. Rather, all information contained in the payload should come directly from Github's API.

We would like you to treat this task as if you were doing it for a client - i.e. use the best practices that you would like to see in a piece of work for others. Keep in mind code formatting, project organization, documentation etc.

Please fork this repository into your personal account. When your work is ready for review, please send us a link.
