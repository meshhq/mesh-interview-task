# Mesh Interview Task

The Mesh interview task is to write a simple HTTP server that is integrated with the GitHub API. It can be written in whatever language you are most comfortable with. You can find all GitHub documentation at the following URL.

https://developer.github.com/

### Implementation

The server should expose a single API that returns a user payload containing information about your personal GitHub account. The payload should look like the following:

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

### Considerations

 * The server should not contain any hard coded information. Rather, all payload information should come directly from GitHub's API. It is up to determine you how the integration will be built and the GitHub data will be processed.
 * Please be sure to strip out any personal information from your payload.

### Quality

We would like you to treat this task as if you were doing it for a client - i.e. use the best practices that you would like to see in a piece of work for others. Keep in mind code formatting, project organization, documentation etc.

### Project Submission

Please fork this repository into your personal account. When your work is ready for review, please send us a link.

### Time Expectation

This task should not take you more than ~4 hours.

### Help

Please feel free to ping us with any questions you might have as you get going. Otherwise we are excited to see what you build!

### Instructions

Make sure the environment the application gets executed contains the environment variables defined on _env.list.sample_. This file can be used when creating a docker image with this application.

To run the application type:
> npm run start-dev

This should spin up the server with nodemon and monitor any changes to the source.

To test the application:
> npm test

This command will execute eslint and the test suites under /test.

To create a docker machine type the following:

> docker build -t <your-name>/githubserver .

To start a new container from this image:

> docker run --env-file ./env.list -p 3010:80 -d <your-name>/githubserver

Notice the _env.list_ filename. This is where the necessary environment variables will be stored. Make sure you DO NOT commit this file since it will contain sensitive information.