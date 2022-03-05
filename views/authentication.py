from flask import (
    request, make_response, render_template, redirect
)
from models import User
import flask_jwt_extended

def logout():
    # hint:  https://dev.to/totally_chase/python-using-jwt-in-cookies-with-a-flask-app-and-restful-api-2p75
    return 'Implement Logout functionality'

def login():
    if request.method == 'POST':
        # authenticate user here. If the user sent valid credentials, set the
        # JWT cookies:
        # https://flask-jwt-extended.readthedocs.io/en/3.0.0_release/tokens_in_cookies/
        return render_template(
            'login.html', 
            message='Invalid password'
        )
    else:
        return render_template(
            'login.html'
        )

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         print(request.form)
#         username = request.form.get('username')
#         password = request.form.get('password')

#         # check database
#         user = User.query.filter_by(username=username).all()
#         if user:
#             print(user)
#             print('Set token')
#         else:
#             print('invalid')

#         print("Handle authentication and token setting")

#     return render_template('login.html')


def initialize_routes(app):
    app.add_url_rule('/login', 
        view_func=login, methods=['GET', 'POST'])
    app.add_url_rule('/logout', view_func=logout)