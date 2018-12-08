/* globals google */
import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";

const MapWithADirectionsRenderer = compose(
  withProps({
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `calc(100vh - 200px)` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route(
        {
          origin: "Warsaw",
          destination: "Cracow",
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
    }
  })
)(props => (
  <GoogleMap defaultZoom={7}>
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

export default MapWithADirectionsRenderer;
