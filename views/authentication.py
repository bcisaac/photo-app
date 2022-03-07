import datetime
from flask import (
    request, make_response, render_template, redirect
)
from models import User
import flask_jwt_extended


def logout():
    # hint:  https://dev.to/totally_chase/python-using-jwt-in-cookies-with-a-flask-app-and-restful-api-2p75
    # return 'Implement Logout functionality'
    response = make_response(redirect('/login', 302))
    flask_jwt_extended.unset_jwt_cookies(response)
    # print('-' * 50)
    # print('access tokens unset')
    # print('-' * 50)
    # print('Cookie (access_token_cookie):', request.cookies.get('access_token_cookie'))
    # print('Cookie (csrf_access_token):', request.cookies.get('csrf_access_token'))
    # print('-' * 50)
    return response

def login():
    if request.method == 'POST':
        print(request.form)
        # authenticate user here. If the user sent valid credentials, set the
        # JWT cookies:
        # https://flask-jwt-extended.readthedocs.io/en/3.0.0_release/tokens_in_cookies/
        username = request.form.get('username')
        password = request.form.get('password')
        # check database:
        results = User.query.filter_by(username=username).all()
        # # lance_anderson
        if len(results)==1: 
            user = results[0]
            print(user.password_plaintext)
            print(user.check_password(password))
            if user.check_password(password):
                expires = datetime.timedelta(minutes=10)
                access_token = flask_jwt_extended.create_access_token(
                    identity=user.id, 
                    expires_delta=expires
                )
                response = make_response(redirect('/', 302))
                flask_jwt_extended.set_access_cookies(response, access_token)
                return response
            else:
                return render_template(
                    'login.html', 
                    message='Invalid password'
                )
        else: 
            return render_template(
                    'login.html', 
                    message='Invalid username'
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