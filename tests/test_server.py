from configparser import ConfigParser
from pprint import pprint
from subprocess import Popen
from time import sleep
from unittest import TestCase

from requests import get

from mesh.server import securely_get_github_credentials


class Server(TestCase):
    '''
    This is more of an integration test than a unit test.
    It's meant to show off a basic test harness that we can build on.
    '''

    def setUp(self):
        conf = ConfigParser()
        conf.read(filenames=['conf/mesh.conf'])
        inet = conf['inet']
        self.ip, self.port = inet['ip'], int(inet['port'])
        self.host_root = f'http://{self.ip}:{self.port}/'
        security = conf['security']
        application, username_tag = security['application'], security['username-tag']
        securely_get_github_credentials(application, username_tag)
        self.server = Popen(['python', '-m', 'mesh.server'])
        print('server is launching. Waiting 1 second...')
        sleep(1)

    def tearDown(self):
        if not self.server.poll():
            self.server.kill()

    def test_root(self):
        r = get(self.host_root)
        self.assertEqual(r.status_code, 404)

    def test_foo_bar_route(self):
        r = get(self.host_root+'foo_bar')
        self.assertEqual(r.status_code, 404)

    def test_payload(self):
        r = get(self.host_root+'githubPayload')
        self.assertEqual(r.status_code, 200)
        #pprint(r.headers)
        self.assertTrue('Content-Type' in r.headers)
        self.assertEqual(r.headers['Content-Type'], 'application/json')
        payload = r.json()
        #pprint(payload)
        self.assertTrue('user' in payload)
        user = payload['user']
        self.assertTrue('githubHandle' in user)
        self.assertTrue('githubURL' in user)
        self.assertTrue('avatarURL' in user)
        self.assertTrue('email' in user)
        self.assertTrue('followerCount' in user)
        self.assertTrue('repositories' in user)
