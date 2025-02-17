import datetime
from dotenv import load_dotenv
load_dotenv()
from flask import Flask, make_response, redirect, request
from flask_restful import Api
from flask_cors import CORS
from flask import render_template
import os
from models import db, User, ApiNavigator
from views import bookmarks, comments, followers, following, posts, profile, stories, suggestions, post_likes
from flask_multistatic import MultiStaticFlask as Flask
from flask import send_from_directory   

# new import statements:
import flask_jwt_extended  
import decorators
# new views:
from views import authentication, token

# Create app
app = Flask(__name__)

app.static_folder = [
    os.path.join(app.root_path, 'react-client', 'build', 'static'),
    os.path.join(app.root_path, 'static')
]

#JWT config variables and manager (add after app object created):
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config["JWT_COOKIE_SECURE"] = False
jwt = flask_jwt_extended.JWTManager(app)

# CORS: allows anyone from anywhere to use your API:
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False    

db.init_app(app)
api = Api(app)

# Updated API endpoint includes a reference to 
# access_token and csrf token.
@app.route('/api')
@decorators.jwt_or_login
def api_docs():
    access_token = request.cookies.get('access_token_cookie')
    csrf = request.cookies.get('csrf_access_token')
    navigator = ApiNavigator(flask_jwt_extended.current_user)
    return render_template(
        'api/api-docs.html', 
        user=flask_jwt_extended.current_user,
        endpoints=navigator.get_endpoints(),
        access_token=access_token,
        csrf=csrf,
        url_root=request.url_root[0:-1] # trim trailing slash
    )

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    # print('JWT data:', jwt_data)
    # https://flask-jwt-extended.readthedocs.io/en/stable/automatic_user_loading/
    user_id = jwt_data["sub"]
    return User.query.filter_by(id=user_id).one_or_none()

# set logged in user
with app.app_context():
    app.current_user = User.query.filter_by(id=12).one()


# Initialize routes for all of your API endpoints:
authentication.initialize_routes(app)
bookmarks.initialize_routes(api)
comments.initialize_routes(api)
followers.initialize_routes(api)
following.initialize_routes(api)
posts.initialize_routes(api)
post_likes.initialize_routes(api)
profile.initialize_routes(api)
stories.initialize_routes(api)
suggestions.initialize_routes(api)
# # # Initialize routes of 2 new views
token.initialize_routes(api)

# Server-side template for the homepage:
@app.route('/')
# @decorators.jwt_or_login
def home():
    # return render_template(
    #     'index.html',
    #     user=flask_jwt_extended.current_user
    #     # app.current_user
    # )

    # https://medium.com/swlh/how-to-deploy-a-react-python-flask-project-on-heroku-edb99309311
    return send_from_directory(app.root_path + '/react-client/build', 'index.html')


# enables flask app to run using "python3 app.py"
if __name__ == '__main__':
    app.run()
