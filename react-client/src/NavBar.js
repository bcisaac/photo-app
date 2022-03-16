import React from 'react';

class NavBar extends React.Component { 

    render () {

            
        return (
            <ul>
                <li><a href="/api">API Docs</a></li>
                <li><span>{this.props.user.username}</span></li>
                <li><a href="/logout">Logout</a></li>
            </ul>
        )
    }

}

export default NavBar