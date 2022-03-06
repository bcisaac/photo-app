import mimetypes
from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db, Post
from my_decorators import handle_db_insert_error
import json
from . import can_view_post
import flask_jwt_extended
from views import security, get_authorized_user_ids
from sqlalchemy import and_

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # Your code here
        bookmarks = Bookmark.query.filter_by(user_id = self.current_user.id).order_by('id').all()

        # convert list of Bookmark model into list of dictionaries
        bookmarks = [
            bookmark.to_dict() for bookmark in bookmarks
        ]

        return Response(json.dumps(bookmarks), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    @handle_db_insert_error
    def post(self):

        body = request.get_json()   
        post_id = body.get("post_id")

        try:
            post_id = int(post_id)
        except:
            return Response(json.dump({'message': 'Invalid post_id format'}, mimetype="application/json", status=400))

        post = Post.query.get(post_id)

        if post == None:
            return Response(json.dumps({'message': 'This post does not exist'}), mimetype="application/json", status=404)

        if not can_view_post(post_id, self.current_user):
            return Response(json.dumps({'message': 'You do not have permission to access this post'}), mimetype="application/json", status=404)

        isBookmarked = Bookmark.query.filter(and_(Bookmark.user_id == self.current_user.id, Bookmark.post_id == post_id)).first()

        if isBookmarked:
            return Response(json.dumps({'message': 'Post {} is already liked'.format(isBookmarked.id)}), mimetype="application/json", status=400)

        # to create a bookmark requires user id and postr_id
        bookmark = Bookmark(self.current_user.id, post_id)
        db.session.add(bookmark)
        db.session.commit()

        Bookmark.query.filter_by(id = self.current_user.id)

        return Response(json.dumps(bookmark.to_dict()), mimetype="application/json", status=201)

    # def handle_db_errors(self,func):
    #     try:
    #         return func(self)
    #     except:
    #         import sys
    #         db_message = str(sys.exc_info()[1]) # stores DB error message
    #         print(db_message)                   # logs it to the console
    #         message = 'Database Insert error. Make sure your post data is valid.'
    #         post_data = request.get_json()
    #         post_data['user_id'] = self.current_user.id
    #         response_obj = {
    #             'message': message, 
    #             'db_message': db_message,
    #             'post_data': post_data
    #         }
    #         return Response(json.dumps(response_obj), mimetype="application/json", status=400)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    # @security.user_can_view_post
    def delete(self, id):
        ''' TODO:
        Get the request
        Check if the id is formatted correctly
        The id is from an actual post and the user is authorized to see that post
        '''

        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'Invalid id format'}), mimetype="application/json", status=400)

        bookmark = Bookmark.query.get(id)

        if not bookmark:
            return Response(json.dumps({'message': 'Not a bookmark'}), mimetype="application/json", status=404)

        if not can_view_post(bookmark.post_id, self.current_user):
            return Response(json.dumps({'message': 'You do not have permission to access this post'}), mimetype="application/json", status=404)

        Bookmark.query.filter_by(id=id).delete()

        db.session.commit()

        serialized_data = {
            'message': 'Bookmark {0} was removed from bookmarks.'.format(id)
        }

        return Response(json.dumps(serialized_data), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<id>', 
        '/api/bookmarks/<id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
