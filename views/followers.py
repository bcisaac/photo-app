from flask import Response, request
from flask_restful import Resource
from models import Following
import json
import flask_jwt_extended

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        
        followers = Following.query.filter_by(following = self.current_user)

        followers = [
            item.to_dict_follower() for item in followers
        ]

        return Response(json.dumps(followers), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
