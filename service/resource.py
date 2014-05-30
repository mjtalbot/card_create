import flask
import os
import uuid
from lib import cfg

app = flask.Blueprint('resource', __name__)

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


def extension(filename):
    return filename.rsplit('.', 1)[1]


@app.route("/", methods=['POST'])
def upload():
    file = flask.request.files['file']
    if file and allowed_file(file.filename):
        filename = '{name}.{extension}'.format(
            name=uuid.uuid4(),
            extension=extension(file.filename)
        )
        file.save(os.path.join(cfg.config['storage']['resource'], filename))
        return flask.jsonify(url='/static/resource/'+filename)
