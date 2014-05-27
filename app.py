import flask
import twitter
import os
import logging
import json
import sys
import yaml

app = flask.Flask(
    'stuff'
)

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
    config = yaml.load(config_file)

    app.twitter = twitter.Twitter()
    app.twitter.acquire_token(
        config['twitter']['key'],
        config['twitter']['secret']
    )
    app.debug = True
    app.run(port = config['app']['port'])
