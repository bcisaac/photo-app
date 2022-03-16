import React from 'react';
import {getHeaders} from './utils.js'
import Post from './components/Post.js'

class Posts extends React.Component { 
    constructor(props){
        super(props)
        this.state = {
            posts: []
        }
        this.getPosts()
    }

    getPosts() {
        fetch('/api/posts/', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            this.setState({
                posts: data
            });
            // when you update the state, you trigger the 
            // render()
        })
    }

    render () {
        
        return (
            <div id="posts">
                {this.state.posts.length >0 ? 
                this.state.posts.map(post => {
                    return <Post key={post.id} model={post} />
                }) : <div>Need new token</div>}
            </div>
        )
    }
}

export default Posts