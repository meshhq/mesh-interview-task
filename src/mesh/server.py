from configparser import ConfigParser
from http.server import HTTPServer, BaseHTTPRequestHandler
from getpass import getpass
from json import dumps
from logging import getLogger, Formatter, StreamHandler
from sys import stdout

from github import Github
from keyring import set_password, get_password


log = getLogger(__name__)


# reduce verbosity of PyGithub
getLogger('github').setLevel('CRITICAL')


def log_to_stdout(level):
    root_logger = getLogger()
    root_logger.setLevel(level)
    streamingHandler = StreamHandler(stdout)
    streamingHandler.setFormatter(
        Formatter(
            '%(asctime)s %(levelname)s %(message)s'
        )
    )
    root_logger.addHandler(streamingHandler)


class GithubRequestHandler(BaseHTTPRequestHandler):

    github = None   # class member will be set to Github object once auth'ed.

    def do_GET(self):
        if self.path == '/githubPayload':
            user = self.github.get_user()
            payload = {
                'user': {
                    'githubHandle': user.login,
                    'githubURL': user.url,
                    'avatarURL': user.avatar_url,
                    'email': user.email,
                    'followerCount': user.followers,
                    'repositories': [
                        {
                            'name': repo.name,
                            'url': repo.url,
                            # see docs/manual.markdown for design alternatives:
                            'commitCount': len(list(repo.get_commits())),
                            'pullRequestCount': len(list(repo.get_pulls()))
                        }
                        for repo in user.get_repos()
                    ]
                }
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(dumps(payload).encode())
        else:
            self.send_response(404)
            self.end_headers()


def securely_ask_user_for_password(application, username):
    password = getpass(prompt=f'Github password for {username}: ')
    set_password(application, username, password)
    log.info(f'Password saved in system Keychain under "{application}"')
    return password


def securely_get_github_credentials(application, username_tag):
    username = get_password(application, username_tag)
    if not username:
        username = input('Github username: ')
        set_password(application, username_tag, username)
        password = securely_ask_user_for_password(application, username)
    else:
        password = get_password(application, username)
        if not password:
            password = securely_ask_user_for_password(username)
    return username, password


def serve():
    conf = ConfigParser()
    conf.read(filenames=['conf/mesh.conf'])
    log_to_stdout(conf['log']['level'])
    inet = conf['inet']
    ip, port = inet['ip'], int(inet['port'])
    security = conf['security']
    application, username_tag = security['application'], security['username-tag']
    GithubRequestHandler.github = Github(*securely_get_github_credentials(application, username_tag))
    server = HTTPServer((ip, port), GithubRequestHandler)
    log.info(f'Server running at http://{ip}:{port}/githubPayload')
    server.serve_forever() # TODO add ctrl-c support for cleaner exits...


if __name__ == '__main__':
    serve()

