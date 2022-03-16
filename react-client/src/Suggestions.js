import React from 'react';
import {getHeaders} from './utils.js'
import Suggestion from './components/Suggestion.js'

class Suggestions extends React.Component { 
    constructor(props) {
        super(props)
        this.state = {
            suggestions: []
        }
        this.getSuggestions()
    }

    getSuggestions() {
        fetch('/api/suggestions/', {
            headers: getHeaders()
        }).then(response => response.json())
        .then(data => {
            this.setState({
                suggestions: data
            });
        })
    }

    render () {
        if (!this.state.suggestions) {
            return (
                <div>Before suggestions fetched from server</div>
            )
        }
        return (
            <div>
            {this.state.suggestions.map(
                suggestion => {
                    return (
                        <Suggestion suggestion={suggestion} key={suggestion.id}></Suggestion>
                    )
                }
            )}
            </div>
        )
    }

}

export default Suggestions