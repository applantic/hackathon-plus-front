import React, { Component } from 'react';
import './App.css';

import GoogleMaps from './components/GoogleMaps'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="header">
          <a
            href="https://applantic.github.io/wemakebuttons/"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            We Make Buttons
          </a>
        </header>
        <GoogleMaps />
      </div>
    );
  }
}

export default App;
