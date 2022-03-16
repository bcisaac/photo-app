import React from 'react';
import NavBar from './NavBar'
import Posts from './Posts'
import Profile from './Profile'
import Stories from './Stories'
import Suggestions from './Suggestions'
import { getHeaders } from './utils';

class App extends React.Component { 

    constructor(props) {
        super(props)
        this.state = {
            user: {}
        }
        this.getProfile()
    }
    
    getProfile() {
        fetch('/api/profile/', {
            method: "GET",
            headers: {
                // 'Authorization': getHeaders()['Authorization']
                headers: getHeaders()
            }
        })
        .then(response => response.json())
        .then(user => {
            console.log(user)
            this.setState({user: user})
        }
        )
    }

    render () {

        return (
            <div>

            <nav className="main-nav">
                <h1>Photo App</h1>
                <NavBar user={this.state.user}></NavBar>
            </nav>

            <aside>
                <header>
                    <Profile user={this.state.user}></Profile>
                </header>
                <div className="suggestions">
                    <p className="suggestion-text">Suggestions for you</p>
                    <Suggestions></Suggestions>
                </div>
            </aside>

            <main className="content">
                <header className="stories">
                    <Stories></Stories>
                </header>
                <Posts></Posts>
            </main>

            </div>
        );
    }
}

export default App;