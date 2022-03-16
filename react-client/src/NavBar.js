import React from 'react';

class NavBar extends React.Component { 

    render () {

            
        return (
            <ul>
                <li><a>API Docs</a></li>
                <li><span>{this.props.user.username}</span></li>
                <li><a>Logout</a></li>
            </ul>
        )
    }

}

export default NavBar