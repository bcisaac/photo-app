import React from 'react';
import {getHeaders} from '../utils.js'

class Bookmark extends React.Component { 
    constructor(props){
        super(props)
        this.toggleBookmark = this.toggleBookmark.bind(this)
        this.bookmarkPost = this.bookmarkPost.bind(this)
        this.unBookmarkPost = this.unBookmarkPost.bind(this)
    }

    // componentDidMount() {
    //   console.log('Invoked immediately')
    // }

    bookmarkPost() {
        const postData = {
            "post_id": this.props.postId
        }
        fetch(`/api/bookmarks/`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.props.requeryPost()
        });
    }

    unBookmarkPost() {
        const deleteURL = `/api/bookmarks/${this.props.bookmarkId}`

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

    toggleBookmark() {
        console.log('button-clicked')

        if (this.props.bookmarkId) {
            // issue post request
            this.unBookmarkPost()
        } else {
            // issue delete request
            this.bookmarkPost()
        }
    }

    render () {
        const bookmarkId = this.props.bookmarkId
        return (
        <button
            onClick={this.toggleBookmark}
            aria-checked={bookmarkId ? true : false}
            role="switch"
            label="Bookmark"
            className='bookmark'>
            <i className={bookmarkId ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>
        </button>
        )
    }
}

export default Bookmark