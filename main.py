#!/usr/bin/env python

import os
import json
import urllib.request, urllib.parse, urllib.error
from urllib.parse import quote_plus

import jinja2

import webapp2
import fixtures
from gameon import gameon
from gameon.gameon_utils import GameOnUtils
from ws import ws


FACEBOOK_APP_ID = "138831849632195"
FACEBOOK_APP_SECRET = "93986c9cdd240540f70efaea56a9e3f2"

config = {}
config['webapp2_extras.sessions'] = dict(secret_key='93986c9cdd240540f70efaea56a9e3f2')

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    # extensions=['jinja2.ext.autoescape']
)


class BaseHandler(webapp2.RequestHandler):
    def render(self, view_name, extraParams={}):
        template_values = {
            'fixtures': fixtures,
            'ws': ws,
            'json': json,
            'GameOnUtils': GameOnUtils,
            # 'facebook_app_id': FACEBOOK_APP_ID,
            # 'glogin_url': users.create_login_url(self.request.uri),
            # 'glogout_url': users.create_logout_url(self.request.uri),
            'url': self.request.uri,
            'host': self.request.host,
            'host_url': self.request.host_url,
            'path': self.request.path,
            'urlencode': quote_plus,
            # 'num_levels': len(LEVELS)
        }
        template_values.update(extraParams)

        template = JINJA_ENVIRONMENT.get_template(view_name)
        self.response.write(template.render(template_values))


class MainHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', True)
        self.render('templates/index.jinja2', {'noads': noads})


class TestsHandler(BaseHandler):
    def get(self):
        self.render('templates/tests.jinja2')


class FbHandler(BaseHandler):
    def get(self):
        # redirect to home
        noads = self.request.get('noads', True)
        self.render('templates/index.jinja2', {'noads': noads})


class ContactHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', True)
        self.render('templates/contact.jinja2', {'noads': noads})


class AboutHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', True)
        self.render('templates/about.jinja2', {'noads': noads})


class PrivacyHandler(BaseHandler):
    def get(self):
        if 'privacy-policy' in self.request.path:
            self.redirect('/privacy', True)

        noads = self.request.get('noads', True)
        self.render('templates/privacy.jinja2', {'noads': noads})


class TermsHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', True)
        self.render('templates/terms.jinja2', {'noads': noads})

class VersusHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', True)
        self.render('templates/versus.jinja2', {'noads': noads})


class TimedHandler(BaseHandler):
    def get(self):

        # self.redirect('/', True)
        noads = self.request.get('noads', True)
        self.render('templates/index.jinja2', {'noads': noads})


class FriendsHandler(BaseHandler):
    def get(self):
        # self.redirect('/versus', True)
        noads = self.request.get('noads', True)
        self.render('templates/versus.jinja2', {'noads': noads})


class GameMultiplayerHandler(BaseHandler):
    def get(self):
        # redirect home
        noads = self.request.get('noads', True)
        self.render('templates/index.jinja2', {'noads': noads})


class GamesHandler(BaseHandler):
    def get(self):
        self.render('templates/index.jinja2', {'noads': True})


class CampaignHandler(BaseHandler):
    def get(self):
        noads = self.request.get('noads', True)
        self.render('templates/campaign.jinja2', {'noads': noads})


class SitemapHandler(BaseHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/xml'
        self.render('sitemap.xml')

class SlashMurdererApp(webapp2.RequestHandler):
    def get(self, url):
        self.redirect(url)


app = webapp2.WSGIApplication([
                                               ('/', MainHandler),
                                               ('(.*)/$', SlashMurdererApp),

                                               ('/privacy', PrivacyHandler),
                                               ('/privacy-policy', PrivacyHandler),
                                               ('/terms', TermsHandler),
                                               ('/facebook', FbHandler),
                                               ('/about', AboutHandler),
                                               ('/contact', ContactHandler),
                                               ('/versus', VersusHandler),
                                               ('/timed', TimedHandler),
                                               ('/multiplayer', FriendsHandler),
                                               ('/games-multiplayer', GameMultiplayerHandler),
                                               ('/games', GamesHandler),

                                               # need js rendering
                                               ('/play', CampaignHandler),

                                               (r'/versus/..*', MainHandler),

                                               (r'/tests', TestsHandler),

                                               ('/sitemap', SitemapHandler),

                                           ] + gameon.routes, debug=ws.debug, config=config)
