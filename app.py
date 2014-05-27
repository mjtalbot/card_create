import flask
import twitter
import os
import logging
import json
import sys
import yaml
import uuid

app = flask.Flask(
    'stuff'
)

@app.route("/")
def index():
    return app.send_static_file('html/base.html')

@app.route("/card/")
def card_list():
    """
    return all available card ids

    cards are stored under the card storage location set by the config
    """
    return flask.jsonify(list = os.listdir(config['storage']['card']))


@app.route("/card/<id>")
def card_details(id):
    """
    return details about specific card
    """
    path = os.path.join(config['storage']['card'], id)
    if not os.path.exists(path):
        flask.abort(404)
    card_details = {}
    with open(path, 'r') as f:
        card_details = json.loads(f.read())
    return flask.jsonify(**card_details)

@app.route("/card/", methods = ["POST"])
@app.route("/card/<id>", methods = ["POST", "PUT"])
def card_store(id = None):
    """
    return details about specific card
    """
    if id == None:
        id = str(uuid.uuid4())
    flask.request.json['id'] = id
    path = os.path.join(config['storage']['card'], id)
    card_details = {}
    with open(path, 'w') as f:
        f.write(json.dumps(flask.request.json))
    return flask.jsonify(uuid = id)


@app.route("/card/<id>", methods = ["DELETE"])
def card_delete(id):
    """
    return details about specific card
    """
    path = os.path.join(config['storage']['card'], id)
    if not os.path.exists(path):
        flask.abort(404)

    os.remove(path)
    return flask.jsonify(success=True)

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

    # ensure storage locations exist
    if not os.path.isdir(config['storage']['card']):
        os.makedirs(config['storage']['card'])
    if not os.path.isdir(config['storage']['template']):
        os.makedirs(config['storage']['template'])
    if not os.path.isdir(config['storage']['resource']):
        os.makedirs(config['storage']['resource'])

    app.twitter = twitter.Twitter()
    app.twitter.acquire_token(
        config['twitter']['key'],
        config['twitter']['secret']
    )
    app.debug = True
    app.run(port = config['app']['port'])
