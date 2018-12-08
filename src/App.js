import React, { Component } from 'react';
import './App.css';

import GoogleMaps from './components/GoogleMaps'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="container">
          <button className="button">
            We Make Buttons
          </button>
          <GoogleMaps />
        </header>
      </div>
    );
  }
}

export default App;
