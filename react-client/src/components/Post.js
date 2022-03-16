import React from 'react';
import Like from './Like.js'
import Bookmark from './Bookmark.js'
import AddComment from './AddComment.js'
import Comments from './Comments.js'
import { getHeaders } from '../utils.js';

class Post extends React.Component { 
    constructor(props){
        super(props)
        this.requeryPost = this.requeryPost.bind(this)
        this.state = {
            post: this.props.model
        }
    }
    
    // componentDidMount() {
    //   console.log('Invoked immediately')
    // }

    requeryPost() {
        console.log('requery post')
        
        fetch('api/posts/' + this.state.post.id, {
            method: "GET",
            headers: {
                // 'Authorization': getHeaders()['Authorization']
                headers: getHeaders()
            }
            

        }).then(response => response.json())
        .then(data => {
            this.setState({post: data})
            console.log('requeried')
        })
    }

    render () {
        const post = this.state.post
        // console.log(post)
        return (
            <section className="card">
                <div className="header">
                    <h3>{post.user.username}</h3>
                    <i className="fa fa-dots"></i>
                </div>
                
                <img 
                    src={ post.image_url } 
                    alt={'Image posted by ' +  post.user.username } 
                    width="300" 
                    height="300" />
                
                <div className="info">
                    <div className = "buttons">
                        <div>
                        <Like 
                        likeId = {post.current_user_like_id}
                        postId = {post.id}
                        requeryPost={this.requeryPost}
                        ></Like>
                        <i className={'far fa-comment'}></i>
                        <i className={'far fa-paper-plane'}></i>
                        </div>
                        <Bookmark
                        bookmarkId = {post.current_user_bookmark_id}
                        postId = {post.id}
                        requeryPost={this.requeryPost}
                        ></Bookmark>
                    </div>
                    <p className="likes">
                        <strong>{post.likes.length >1 || post.likes.length === 0 ? post.likes.length + " likes" : post.likes.length + " like"}</strong>
                    </p>
                    <div className="caption">
                        <p>
                            <strong>{post.user.username}</strong>
                            {post.caption}
                        </p>
                        <p className="timestamp">{post.display_time}</p>
                    </div>
                    <Comments
                        comments={post.comments}>
                    </Comments>
                </div>
                <AddComment
                postId={post.id}
                requeryPost={this.requeryPost}>
                </AddComment>
            </section> 
        )
    }
}

export default Post