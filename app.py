import flask
import twitter
import os
import sys
import yaml

from lib import cfg

from service.card import app as card_app
from service.template import app as template_app

app = flask.Flask(
    'stuff'
)

app.register_blueprint(card_app, url_prefix = '/card')
app.register_blueprint(template_app, url_prefix = '/template')

@app.route("/")
def index():
    return app.send_static_file('html/base.html')

@app.route('/timeline/<name>')
def timeline(name):
    x = {'timeline': app.twitter.get_timeline(name)}
    return flask.jsonify(**x)

@app.route('/profile/<name>')
def profile(name):
    x = {'profile': app.twitter.get_profile(name)}
    return flask.jsonify(**x)

if __name__ == '__main__':

    config_path = sys.argv[1]
    config_file = ''
    with open(config_path,'r') as f:
        config_file = f.read()

    cfg.initialize(yaml.load(config_file))

    # ensure storage locations exist
    if not os.path.isdir(cfg.config['storage']['card']):
        os.makedirs(cfg.config['storage']['card'])
    if not os.path.isdir(cfg.config['storage']['template']):
        os.makedirs(cfg.config['storage']['template'])
    if not os.path.isdir(cfg.config['storage']['resource']):
        os.makedirs(cfg.config['storage']['resource'])

    app.twitter = twitter.Twitter()
    app.twitter.acquire_token(
        cfg.config['twitter']['key'],
        cfg.config['twitter']['secret']
    )
    app.debug = True
    app.run(port = cfg.config['app']['port'])
