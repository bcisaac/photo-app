import React from 'react';

function Comment(props) {
    return (
        <div key={props.comment.id}>
            <p>
            <strong>{props.comment.user.username}</strong>
            {props.comment.text}
            </p>
            <p className='timestamp'>
            {props.comment.display_time}
            </p>
        </div>
    )
}

class Comments extends React.Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render () {
        // console.log(this.props.comments ? this.props.comments[0] : 'no comments')
        // console.log(this.props.comments)
        const comments = this.props.comments
        // console.log(comments)

        if (comments.length===1) {
            return (
                <div className='comments'>
                    <Comment comment={comments[comments.length-1]}></Comment>
                </div>
            )
        } else if (comments.length>1) {
            return (
                <div>
                    <button className='link'>
                        {'View all ' + comments.length + " comments"}
                    </button>
                    <Comment comment={comments[comments.length-1]}></Comment>
                </div>
            )
        } else {
            return (
                <div>
                    No comments
                </div>
            )
        }
    }
}

export default Comments