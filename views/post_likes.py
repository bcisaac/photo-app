from flask import Response, session
from flask_restful import Resource
from models import LikePost, Post, db
from sqlalchemy import and_
import json
from . import can_view_post

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self, post_id):
        # Your code here
        try:
            post_id = int(post_id)
        except:
            return Response(json.dumps({'message': 'Invalid post_id format'}), mimetype="application/json", status=400)

        post = Post.query.filter_by(id = post_id)

        if post == None:
            return Response(json.dumps({'message': 'This post does not exist'}), mimetype="application/json", status=404)

        if not can_view_post(post_id, self.current_user):
            return Response(json.dumps({'message': 'You do not have permission to comment on this post'}), mimetype="application/json", status=404)

        isLiked = LikePost.query.filter(and_(LikePost.user_id == self.current_user.id, LikePost.post_id == post_id)).first()

        if isLiked:
            return Response(json.dumps({'message': 'Post {} is already liked'.format(isLiked.id)}), mimetype="application/json", status=400)

        print('made it')
        like = LikePost(self.current_user.id, post_id)
        db.session.add(like)
        db.session.commit()

        return Response(json.dumps(like.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, post_id, id):
        # Your code here
        try:
            post_id = int(post_id)
        except:
            return Response(json.dumps({'message': 'Invalid post_id format'}), mimetype="application/json", status=400)

        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'Invalid id format'}), mimetype="application/json", status=400)

        likedPost = LikePost.query.get(id)

        if likedPost == None:
            return Response(json.dumps({'message': 'This post is not already liked'}), mimetype="application/json", status=404)

        if likedPost.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'You did not like this post'}), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(json.dumps({'message': 'Deleted like from post {}'.format(post_id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/<post_id>/likes', 
        '/api/posts/<post_id>/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/<post_id>/likes/<id>', 
        '/api/posts/<post_id>/likes/<id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
