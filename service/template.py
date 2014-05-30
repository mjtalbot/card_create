import flask
import os
import uuid
import json
from lib import cfg

app = flask.Blueprint('template',__name__)

@app.route("/")
def template_list():
    """
    return all available template ids

    templates are stored under the template storage location set by the config
    """
    return flask.jsonify(list = os.listdir(cfg.config['storage']['template']))


@app.route("/<id>")
def template_details(id):
    """
    return details about specific template
    """

    path = os.path.join(cfg.config['storage']['template'], id)
    if not os.path.exists(path):
        flask.abort(404)
    template_details = {}
    with open(path, 'r') as f:
        template_details = json.loads(f.read())
    return flask.jsonify(**template_details)

@app.route("/", methods = ["POST"])
@app.route("/<id>", methods = ["POST", "PUT"])
def template_store(id = None):
    """
    return details about specific template
    """
    if id == None:
        id = str(uuid.uuid4())
    flask.request.json['id'] = id
    path = os.path.join(cfg.config['storage']['template'], id)
    template_details = {}
    with open(path, 'w') as f:
        f.write(json.dumps(flask.request.json))
    return flask.jsonify(uuid = id)


@app.route("/<id>", methods = ["DELETE"])
def template_delete(id):
    """
    return details about specific template
    """
    path = os.path.join(config['storage']['template'], id)
    if not os.path.exists(path):
        flask.abort(404)

    os.remove(path)
    return flask.jsonify(success=True)
