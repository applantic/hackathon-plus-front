import React from "react";
import { compose, withProps } from "recompose";
import mapsConfig from "./mapsConfig";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";

class MapWithADirectionsRenderer extends React.PureComponent {
  render() {
    const { directions, options = {}, ...props } = this.props;

    return (
      <GoogleMap
        defaultZoom={7}
        fullscreenControl={false}
        streetView={false}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          styles: mapsConfig,
          ...options
        }}
        {...props}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `calc(100vh - 26px)` }} />,
    mapElement: <div style={{ height: `calc(100vh - 26px)` }} />
  }),
  withGoogleMap
)(MapWithADirectionsRenderer);
