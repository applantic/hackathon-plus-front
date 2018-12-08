/* globals google */
import React, { Component } from "react";
import moment from "moment";
import "./App.sass";

import GoogleMaps from "./components/GoogleMaps";
import LocationSearchInput from "./components/LocationSearchInput/LocationSearchInput";
import Datepicker from "./components/Datepicker";
class App extends Component {
  DirectionsService = new google.maps.DirectionsService();
  defaultMapLocation = { lng: 52.2330653, lat: 20.9211106 }; // warsaw
  state = {
    directions: null,
    tripDate: moment(),
    datepickerFocused: false,
    startGeo: null,
    endGeo: null,
    stationsData: []
  };

  getTrainStations = async () => {
    const stations = [];

    this.state.directions.routes[0].legs[0].steps
      .filter(step => step.travel_mode === "TRANSIT")
      .map(route => route.transit)
      .forEach(route => {
        if (!stations.includes(route.departure_stop)) {
          stations.push(route.departure_stop);
        }
        if (!stations.includes(route.arrival_stop)) {
          stations.push(route.arrival_stop);
        }
      });

    const stationsQuery = stations.map(
      station => "Nazwa_dworca=" + station.name
    );
    const stationsData = await fetch(
      "https://hackathon-plus-api.herokuapp.com/PRM?" + stationsQuery.join("&")
    ).then(res => res.json());
    this.setState({ stationsData: stationsData });
  };

  getDirections = () => {
    const { startGeo, endGeo } = this.state;
    if (!startGeo || !endGeo) return;

    this.DirectionsService.route(
      {
        origin: new google.maps.LatLng(startGeo.lat, startGeo.lng),
        destination: new google.maps.LatLng(endGeo.lat, endGeo.lng),
        travelMode: google.maps.TravelMode.TRANSIT,
        drivingOptions: {
          departureTime: this.state.tripDate.toDate()
        }
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState(
            {
              directions: result
            },
            this.getTrainStations
          );
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
          <Datepicker
            id="DATE"
            date={this.state.tripDate}
            numberOfMonths={1}
            showDefaultInputIcon
            onDateChange={tripDate => {
              console.log(tripDate);
              this.setState({ tripDate });
            }}
            focused={this.state.datepickerFocused}
            onFocusChange={({ focused }) =>
              this.setState({ datepickerFocused: focused })
            }
          />
          <button className="button" onClick={this.getDirections}>
            Sprawdź
          </button>
        </header>
        <main>
          <GoogleMaps
            defaultCenter={this.defaultMapLocation}
            directions={this.state.directions}
          />
          <div>
            {this.state.stationsData.map(station => (
              <div key={station.Id}>{station.Nazwa_dworca}</div>
            ))}
          </div>
        </main>
        <footer className="footer">
          <p>Made with</p>
          <span role="img" aria-label="serce" className="emoji">
            ❤️
          </span>
          <p>by</p>
          <a
            className="link-to-authors"
            href="https://applantic.github.io/wemakebuttons/"
          >
            We Make Buttons - Hackaton Team
          </a>
          <p>in</p>
          <span role="img" aria-label="flaga polski" className="emoji">
            🇵🇱
          </span>
          <p>2018</p>
        </footer>
      </div>
    );
  }
}

export default App;
