import React from 'react';
import { getHeaders } from '../utils.js';

class AddComment extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value:""
        }
        this.handleChange = this.handleChange.bind(this)
        this.postComment = this.postComment.bind(this)
        this.formRef = React.createRef()
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        })
    }

    postComment(event) {
        event.preventDefault()
        const postData = {
            "post_id": this.props.postId,
            "text": this.state.value
        }
        fetch(`/api/comments/`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            this.props.requeryPost()
        })
        
        this.formRef.current.focus()
    }

    render () {
        
        return (
            <form className='add-comment' onSubmit={this.postComment}>
                <div className='input-holder'>
                    <input className='comment-textbox'
                        aria-label='Add a comment'
                        placeholder='Add a comment...'
                        onChange={this.handleChange}
                        ref={this.formRef}>
                    </input>
                </div>
                <button className='link'
                    type="submit"
                    onClick={this.postComment}>
                    Post
                </button>
            </form>
        )
    }
}

export default AddComment