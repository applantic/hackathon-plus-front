import React, { Component } from "react";
import "./App.css";

import GoogleMaps from "./components/GoogleMaps";
import LocationSearchInput from "./components/LocationSearchInput/LocationSearchInput";
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="header">
          <LocationSearchInput
            placeholder="Jadę z ..."
          />
          <LocationSearchInput
            placeholder="Jadę do ..."
          />
          <button className="button">Sprawdź</button>
        </header>
        <main>
          <GoogleMaps />
        </main>
        <footer>
          <div>We Make Buttons</div>
        </footer>
      </div>
    );
  }
}

export default App;
