import React from 'react';
import { getHeaders } from '../utils.js';
import Follow from './Follow.js'

class Suggestion extends React.Component {
    constructor(props){
        super(props)
        this.toggleFollow = this.toggleFollow.bind(this)
        this.state = {
            user: this.props.suggestion,
            followId: 0
        }
    }

    toggleFollow() {
        console.log('button-clicked')

        if (this.state.followId) {
            // issue post request
            this.unFollow()
        } else {
            // issue delete request
            this.follow()
        }
    }

    unFollow() {
        const deleteURL = `/api/following/${this.state.followId}`

        fetch(deleteURL, {
            method: "DELETE",
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                followId: 0
            })
        });
    }

    follow() {
        const postData = {
            "user_id": this.state.user.id
        }
        fetch(`/api/following/`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                followId: data.id
            })
        });
    }

    render () {
        const user = this.state.user
        const follow_id = this.state.followId
        const user_id = "suggestion-" + user.id
        const alt_text = "Profile pic for " + user.username

        return (
            <section id={user_id}>
            <img src={user.thumb_url} 
                className="pic" 
                alt={alt_text}>
            </img>
            <div>
                <p>{user.username}</p>
                <p>"suggested for you"</p>
            </div>
            <div>
                <Follow
                    username={user.username} 
                    followId= {follow_id} 
                    toggleFollow={this.toggleFollow}>
                </Follow>
            </div>
            </section>
        )
    }
}

export default Suggestion