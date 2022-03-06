from models import User
import flask_jwt_extended
from flask import Response, request
from flask_restful import Resource
import json
from datetime import timezone, datetime, timedelta

class AccessTokenEndpoint(Resource):

    def post(self):
        body = request.get_json() or {}
        password = body.get('password')
        username = body.get('username')
        # check username and log in credentials. If valid, return tokens
        user = User.query.filter_by(username=username).one_or_none()
        if user and user.check_password(password):
            return Response(json.dumps({ 
                "access_token": flask_jwt_extended.create_access_token(user.id), 
                "refresh_token": flask_jwt_extended.create_refresh_token(user.id)
            }), mimetype="application/json", status=200)
        elif user:
            return Response(json.dumps({
                "message": "bad password"
            }), mimetype="application/json", status=401)
        else:
            return Response(json.dumps({
                "message": "bad username"
            }), mimetype="application/json", status=401)


class RefreshTokenEndpoint(Resource):
    
    def post(self):

        body = request.get_json() or {}
        refresh_token = body.get('refresh_token')
        '''
        https://flask-jwt-extended.readthedocs.io/en/latest/refreshing_tokens/
        '''
        decoded_token = flask_jwt_extended.decode_token(refresh_token)
        exp_timestamp = decoded_token.get("exp")
        user_id = decoded_token.get("sub")
        # flask_jwt_extended.get_jwt_identity(refresh_token)
        current_timestamp = datetime.timestamp(datetime.now(timezone.utc))
        if current_timestamp > exp_timestamp:
            # token has expired:
            return Response(json.dumps({ 
                    "message": "refresh_token has expired"
                }), mimetype="application/json", status=401)
        else:
            # issue new token:
            return Response(json.dumps({ 
                    "access_token": flask_jwt_extended.create_access_token(user_id)
                }), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        AccessTokenEndpoint, 
        '/api/token', '/api/token/'
    )

    api.add_resource(
        RefreshTokenEndpoint, 
        '/api/token/refresh', '/api/token/refresh/'
    )