from flask import Response, request
from flask_restful import Resource
from . import can_view_post
import json
from models import db, Comment, Post
import flask_jwt_extended

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def post(self):
        # Your code here
        body = request.get_json()
        post_id = body.get("post_id")
        text = body.get("text")

        if not text or text == "":
            return Response(json.dumps({'message': 'Comment needs text'}), mimetype="application/json", status=400)

        try:
            post_id = int(post_id)
        except:
            return Response(json.dumps({'message': 'Invalid post_id format'}), mimetype="application/json", status=400)

        post = Post.query.get(post_id)

        if post == None:
            return Response(json.dumps({'message': 'This post does not exist'}), mimetype="application/json", status=404)

        if not can_view_post(post_id, self.current_user):
            return Response(json.dumps({'message': 'You do not have permission to comment on this post'}), mimetype="application/json", status=404)

        comment = Comment(text, self.current_user.id, post_id)
        db.session.add(comment)
        db.session.commit()

        return Response(json.dumps(comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # Your code here

        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'Invalid id fomrat'}), mimetype="application/json", status=400)

        comment = Comment.query.get(id)

        if not comment:
            return Response(json.dumps({'message': 'Not a comment'}), mimetype="application/json", status=404)

        if comment.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'You can only delete your own comments'}), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()

        db.session.commit()

        serialized_data = {
            'message': 'Comment {0} was removed from bookmarks.'.format(id)
        }

        return Response(json.dumps(serialized_data), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<id>', 
        '/api/comments/<id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
