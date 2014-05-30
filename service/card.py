import flask
import os
import uuid
import json
from lib import cfg

app = flask.Blueprint('card', __name__)


@app.route("/")
def card_list():
    """
    return all available card ids

    cards are stored under the card storage location set by the config
    """
    return flask.jsonify(list=os.listdir(cfg.config['storage']['card']))


@app.route("/<id>")
def card_details(id):
    """
    return details about specific card
    """

    path = os.path.join(cfg.config['storage']['card'], id)
    if not os.path.exists(path):
        flask.abort(404)
    card_details = {}
    with open(path, 'r') as f:
        card_details = json.loads(f.read())
    return flask.jsonify(**card_details)


@app.route("/", methods=["POST"])
@app.route("/<id>", methods=["POST", "PUT"])
def card_store(id=None):
    """
    return details about specific card
    """
    if id is None:
        id = str(uuid.uuid4())
    flask.request.json['id'] = id
    path = os.path.join(cfg.config['storage']['card'], id)
    with open(path, 'w') as f:
        f.write(json.dumps(flask.request.json))
    return flask.jsonify(uuid=id)


@app.route("/<id>", methods=["DELETE"])
def card_delete(id):
    """
    return details about specific card
    """
    path = os.path.join(cfg.config['storage']['card'], id)
    if not os.path.exists(path):
        flask.abort(404)

    os.remove(path)
    return flask.jsonify(success=True)
