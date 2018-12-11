/* globals google */
import moment from "moment";
import React, { Component } from "react";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import "./App.sass";
import Datepicker from "./components/Datepicker";
import GoogleMaps from "./components/GoogleMaps";
import Info from "./components/Info/Info";
import LocationSearchInput from "./components/LocationSearchInput/LocationSearchInput";
import Sidebar from "./components/Sidebar/Sidebar";
import { getJsonFromUrl } from "./params-parser";
import _ from "lodash";

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
          stations.push({
            ...route.departure_stop,
            time: {
              text: route.departure_time.text,
              value: moment(route.departure_time.vaule)
            }
          });
        }
        if (!stations.includes(route.arrival_stop)) {
          stations.push({
            ...route.arrival_stop,
            time: {
              text: route.arrival_time.text,
              value: moment(route.arrival_time.vaule)
            }
          });
        }
      });

    const stationsQuery = stations.map(
      station => "Nazwa_dworca=" + station.name
    );
    const stationsData = await fetch(
      "http://68.183.222.189/PRM?" + stationsQuery.join("&")
    ).then(res => res.json());

    const mapped = stationsData.map(station => ({
      ...station,
      ...stations.find(s => s.name === station.Nazwa_dworca)
    }));

    const ordered = _.orderBy(mapped, o => o.time.value, ["asc"]);

    this.setState({ stationsData: ordered });
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
          this.setState({
            directions: "no_data",
            stationsData: [],
            loadingInitialLoc: false
          });
          console.log(result);
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
            <div className="directions-view">
              <button
                className="button button-small"
                onClick={() => {
                  this.setState({ directions: null });
                }}
              >
                Cofnij
              </button>
              {this.state.directions !== "no_data" ? (
                <Info stations={this.state.stationsData} />
              ) : (
                <h3 style={{ textAlign: "center" }}>
                  Niestety nie znaleźliśmy takich przejazdów{" "}
                  <span role="img" aria-label="przepraszamy">
                    😢
                  </span>
                </h3>
              )}
              <button className="button help">POPROŚ O POMOC</button>
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
                }}
              >
                Szukaj
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
