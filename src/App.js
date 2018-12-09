/* globals google */
import React, { Component } from "react";
import moment from "moment";
import "./App.sass";

import GoogleMaps from "./components/GoogleMaps";
import LocationSearchInput from "./components/LocationSearchInput/LocationSearchInput";
import Datepicker from "./components/Datepicker";
import Sidebar from "./components/Sidebar/Sidebar";
import Info from "./components/Info/Info";
import { getJsonFromUrl } from "./params-parser";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

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
    stationsData: [],
    loadingInitialLoc: false
  };

  componentDidMount() {
    const params = getJsonFromUrl();

    if (params.from && params.to) {
      this.setState({ loadingInitialLoc: true });

      Promise.all([geocodeByAddress(params.from), geocodeByAddress(params.to)])
        .then(([from, to]) => {
          return Promise.all([getLatLng(from[0]), getLatLng(to[0])]);
        })
        .then(([from, to]) => {
          this.setState(
            {
              startGeo: from,
              endGeo: to
            },
            this.getDirections
          );
        });
    }
  }

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
              directions: result,
              loadingInitialLoc: false
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
          {this.state.loadingInitialLoc ? (
            <div>Ładuje dane przejazdu...</div>
          ) : this.state.directions ? (
            <div>
              <button
                className="button"
                onClick={() => {
                  this.setState({ directions: null });
                }}
              >
                Cofnij
              </button>
              <Info stations={this.state.stationsData} />
            </div>
          ) : (
            <>
              <h2 className="App__title">Znajdź przejazd</h2>
              <LocationSearchInput
                inputRef={ref => (this.$input1 = ref)}
                onChange={startGeo => this.setState({ startGeo })}
                placeholder="Odkąd ..."
              />
              <LocationSearchInput
                inputRef={ref => (this.$input2 = ref)}
                onChange={endGeo => this.setState({ endGeo })}
                placeholder="Dokąd ..."
              />
              <div className="form-row">
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
              </div>
              <button
                className="button"
                onClick={() => {
                  this.getDirections();
                  // this.setState({ isSidebarOpen: false });
                }}
              >
                Sprawdź
              </button>
            </>
          )}
        </Sidebar>
        <main onClick={() => this.setState({ isSidebarOpen: false })}>
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
            WeMakeButtons
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
