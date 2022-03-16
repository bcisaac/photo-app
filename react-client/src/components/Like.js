import React from 'react';
import {getHeaders} from '../utils.js'

class Like extends React.Component { 
    constructor(props){
        super(props)
        this.toggleLike = this.toggleLike.bind(this)
        this.likePost = this.likePost.bind(this)
        this.unLikePost = this.unLikePost.bind(this)
    }
    
    // componentDidMount() {
    //   console.log('Invoked immediately')
    // }

    likePost() {
        fetch(`/api/posts/${this.props.postId}/likes/`, {
            method: "POST",
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.props.requeryPost()
        });
    }

    unLikePost() {
        const deleteURL = `/api/posts/${this.props.postId}/likes/${this.props.likeId}`

        fetch(deleteURL, {
            method: "DELETE",
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.props.requeryPost()
        });
    }

    toggleLike(likeId) {
        console.log('button-clicked')

        if (likeId) {
            // issue post request
            this.unLikePost()
        } else {
            // issue delete request
            this.likePost()
        }
    }

    render () {
        const likeId = this.props.likeId
        return (
        <button
            onClick={() => this.toggleLike(likeId)}
            checked={likeId ? true : false}
            role="switch"
            aria-checked={likeId ? true : false}
            label="Like"
            className='like'>
            <i className={likeId ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
        )
    }
}

export default Like