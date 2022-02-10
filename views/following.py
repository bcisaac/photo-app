from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
from sqlalchemy import and_
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        
        following = Following.query.filter_by(follower = self.current_user)

        following = [
            item.to_dict_following() for item in following
        ]

        return Response(json.dumps(following), mimetype="application/json", status=200)

    def post(self):
        
        user_id = request.get_json().get('user_id')

        if not user_id:
            return Response(json.dumps({'message': 'Missing user_id parameter'}), mimetype="application/json", status=400)

        try:
            user_id = int(user_id)
        except:
            return Response(json.dumps({'message': 'user_id parameter must be an integer'}), mimetype="application/json", status=400)

        if not User.query.get(user_id):
            return Response(json.dumps({'message': 'User does not exist'}), mimetype="application/json", status=404)


        link = Following.query.filter(and_(Following.follower == self.current_user, Following.following_id == user_id)).first()

        if link:
            return Response(json.dumps({'message': 'You are already following this user'}), mimetype="application/json", status=400)

        following = Following(self.current_user.id, user_id)
        db.session.add(following)
        db.session.commit()

        return Response(json.dumps(following.to_dict_following()), mimetype="application/json", status=201)


class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):

        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'ID format is invalid'}), mimetype="application/json", status=400)

        following = Following.query.get(id)

        if not following:
            return Response(json.dumps({'message': 'ID does not exist'}), mimetype="application/json", status=404)

        print(following.user_id == self.current_user.id)

        print(following.follower)
        print(self.current_user)

        if following.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'You are not following this user'}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({'message': 'Deleted unfollowed User {}'.format(following.following_id)}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<id>', 
        '/api/following/<id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
