import React from 'react';
import {getHeaders} from './utils.js'

function Story(props) {
    return (
        <div>
            <img src={props.story.user.thumb_url}
                className="pic"
                alt={"profile pic for " + props.story.user.username}>
            </img>
            <p>
                {props.story.user.username}
            </p>
        </div>
    )
}

class Stories extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            stories: []
        }
        this.getStories()
    }

    getStories() {
        fetch('/api/stories/', {
            method: "GET",
            headers: getHeaders()
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                stories: data
            })
        })
    }

    render () {
        return this.state.stories.map(story => {
            return <Story story={story} key={story.id}></Story>
        })
    }

}

export default Stories