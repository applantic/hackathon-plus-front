import React, { Component } from "react";
import Input from "./components/Input/Input";
import "./App.css";

import GoogleMaps from "./components/GoogleMaps";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="header">
          <Input />
          <Input />
          <button className="button">We Make Buttons</button>
        </header>
        <GoogleMaps />
      </div>
    );
  }
}

export default App;
