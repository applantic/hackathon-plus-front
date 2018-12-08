import React, { Component } from "react";
import Input from "./components/Input/Input";
import "./App.css";

import GoogleMaps from "./components/GoogleMaps";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="container">
          <button className="button">We Make Buttons</button>
          <Input />
          <Input />
        </header>
        <GoogleMaps />
      </div>
    );
  }
}

export default App;