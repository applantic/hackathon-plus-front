/* globals google */
import React, { Component } from "react";
import "./App.css";

import GoogleMaps from "./components/GoogleMaps";
import LocationSearchInput from "./components/LocationSearchInput/LocationSearchInput";
class App extends Component {
  DirectionsService = new google.maps.DirectionsService();
  state = {
    directions: null,
    startGeo: null,
    endGeo: null
  };

  getDirections = () => {
    const { startGeo, endGeo } = this.state;
    if (!startGeo || !endGeo) return;

    this.DirectionsService.route(
      {
        origin: new google.maps.LatLng(startGeo.lat, startGeo.lng),
        destination: new google.maps.LatLng(endGeo.lat, endGeo.lng),
        travelMode: google.maps.TravelMode.TRANSIT
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  render() {
    return (
      <div className="App">
        <header className="header">
          <LocationSearchInput
            onChange={startGeo => this.setState({ startGeo })}
            placeholder="Jadę z ..."
          />
          <LocationSearchInput
            onChange={endGeo => this.setState({ endGeo })}
            placeholder="Jadę do ..."
          />
          <button className="button" onClick={this.getDirections}>
            Sprawdź
          </button>
        </header>
        <main>
          <GoogleMaps directions={this.state.directions} />
        </main>
        <footer>
          <div>We Make Buttons</div>
        </footer>
      </div>
    );
  }
}

export default App;
