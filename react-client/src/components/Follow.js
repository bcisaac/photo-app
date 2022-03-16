import React from 'react';

class Follow extends React.Component { 

    render () {
        const followId = this.props.followId
        return (
        <button
            onClick={this.props.toggleFollow}
            role="switch"
            aria-checked={followId}
            label={"Follow " + this.props.username}
            className='link following'>
            {followId ? "unfollow" : "follow"}
        </button>
        )
    }
}

export default Follow