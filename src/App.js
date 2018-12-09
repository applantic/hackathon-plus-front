/* globals google */
import React, { Component } from "react";
import moment from "moment";
import "./App.sass";

import GoogleMaps from "./components/GoogleMaps";
import LocationSearchInput from "./components/LocationSearchInput/LocationSearchInput";
import Datepicker from "./components/Datepicker";
import Sidebar from "./components/Sidebar/Sidebar";
class App extends Component {
  DirectionsService = new google.maps.DirectionsService();
  defaultMapLocation = { lng: 21.012229, lat: 52.229676 }; // warsaw
  state = {
    directions: null,
    isSidebarOpen: true,
    tripDate: moment(),
    tripTime: moment(),
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
        transitOptions: {
          modes: [google.maps.TransitMode.TRAIN]
        },
        drivingOptions: {
          departureTime: this.state.tripDate
            .set({
              hour: this.state.tripTime.hour(),
              minute: this.state.tripTime.minute()
            })
            .clone()
            .toDate()
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
        <Sidebar
          onChange={isSidebarOpen => this.setState({ isSidebarOpen })}
          isOpen={this.state.isSidebarOpen}
        >
          <h2 className="App__title">Znajdź przejazd</h2>
          <LocationSearchInput
            onChange={startGeo => this.setState({ startGeo })}
            placeholder="Jadę z ..."
          />
          <LocationSearchInput
            onChange={endGeo => this.setState({ endGeo })}
            placeholder="Jadę do ..."
          />
          <div className="Datepicker">
            <Datepicker
              date={this.state.tripDate}
              numberOfMonths={1}
              onDateChange={tripDate => this.setState({ tripDate })}
              focused={this.state.datepickerFocused}
              onFocusChange={({ focused }) =>
                this.setState({ datepickerFocused: focused })
              }
            />
          </div>
          <input
            value={this.state.tripTime.format("HH:mm")}
            type="time"
            min="00:00"
            max="23:59"
            className="Timepicker"
            onChange={e => {
              const time = e.target.value.split(":");
              this.setState({
                tripTime: moment().set({
                  hour: time[0],
                  minute: time[1]
                })
              });
            }}
          />
          <button
            className="button"
            onClick={() => {
              this.getDirections();
              this.setState({ isSidebarOpen: false });
            }}
          >
            Sprawdź
          </button>

          <div>
            {this.state.stationsData.map(station => (
              <div key={station.Id}>{station.Nazwa_dworca}</div>
            ))}
          </div>
        </Sidebar>
        <main>
          <GoogleMaps
            defaultCenter={this.defaultMapLocation}
            directions={this.state.directions}
          />
        </main>
        <footer className="footer">
          Made with
          <span role="img" aria-label="serce" className="emoji">
            ❤️
          </span>
          by
          <a
            className="link-to-authors"
            href="https://applantic.github.io/wemakebuttons/"
          >
            We Make Buttons
          </a>
          in
          <span role="img" aria-label="flaga polski" className="emoji">
            🇵🇱
          </span>
          2018
        </footer>
      </div>
    );
  }
}

export default App;
