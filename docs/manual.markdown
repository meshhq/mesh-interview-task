# Mesh Github Integration HTTP Server

## Features

### API

#### /githubPayload

##### GET

Returns a JSON encoded payload like this:
```JSON
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

## Production 
The main target for production is a linux container running this server unprivileged.
To make the container easy to build, we use a single installation step (a.k.a. 'pip install our_stuff').
To achieve that, we build a python wheel, which is a single compressed file containing
all the code and data, minus the external dependencies. The deps are automatically fetched while installing.
Make sure a keychain solution is available when building the container, use 'Docker secret' when running in Docker Swarm.

### Build

Note these steps should be integrated with the CI/CD solution used at Mesh.

```bash

python3 -m venv ~/venv/mesh-interview-task

. ~/venv/mesh-interview-task/bin/activate

mkdir -p ~/venv/mesh-interview-task/wheels

pip install -U pip wheel

python setup.py bdist_wheel -w ~/venv/mesh-interview-task/wheels

# -> this should produce a .whl file in ~/venv/mesh-interview-task/wheels

```

### Installation
```bash
# first, create a production virtual environment inside the container.
# then, assuming a 'wheels' dir is mounted inside the container:

# copy conf/mesh.conf into container build context with appropriate values
# make sure the location is relative to CWD

pip install -f /wheels mesh-interview-task
```

### Running the server
```bash
# inside the container's production virtual environment

python -m mesh.server
```

## Development

Note, for simplicity's sake we re-use the virtual environment described in Production.

### Installation

```bash
# skip these two steps if already performed earlier.
python3 -m venv ~/venv/mesh-interview-task
. ~/venv/mesh-interview-task/bin/activate

pip install flake8  # linter, PEP-8 code formatting compliance

python setup.py develop  #  allows code editing while using the same production layout

```

### Testing

*TODO* provide separate 'test_setup.py' to remove 'requests' lib dependency from production deps.

```bash

python -m unittest

```

### Running the server

```bash
python -m mesh.server
```

### CI/CD integration
* add flake8 lib as linter.


## Design Notes

* meant to be run inside a container (Docker) for production, or directly on the developer's machine for development.
* should be fronted by NginX+WSGI (gUnicorn) or similar for protection and scaling, if this were to be shipped.
* single threaded, single process, synchronous, no internal (memoization) or external (Redis) caching.
* to serve this single API route ('/githubPayload'), we use Python's Standard Library's http.server.
* use PyGithub for api parsing.
* alt: use a framework (Django, Flask, etc.), overkill for this project though.
* alt: work from raw socket to show off some ninja sk33llz, we don't need no framework!
* alt: use raw JSON response instead of using lib (PyGithub), again skills vs reliability & productivity
* for simplicity, use Github API v3 (Rest), vs v4 (GraphQL). Better familiarity and more robust libraries available immediately.
* for simplicity, use (login, password), vs OAuth token. In real-life, OAuth with app registration is a must.
* no string localization


### Performance
Obviously, performance comes last with this design approach.
The main slow down comes from the computation of the 'commitCount' and 'pullRequestCount' fields for each repo.
As they do not match directly with fields provided by the api, we have to process many requests to get to the information.
To alleviate the problem we could:
* ask the client whether these fields are really needed.
* assuming they are, provide a better way to compute them: replace GET with HEAD & use pagination headers.
* to avoid running into api rate limits, add an ETag caching solution.
* asynchronously compute these fields and use a placeholder value ('computing...') while the final values are being computed.
* use Github Events to pre-compute everything and only return a cached value.


### Security
* to avoid leaking passwords, we chose to use the system's keychain, for both production and development.
* with Docker, we could forgo the keychain and use the Docker secret sharing infrastructure.
* run unprivileged in production (not implemented)
