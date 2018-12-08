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
    const { directions } = this.props;

    return (
      <GoogleMap defaultOptions={{ styles: mapsConfig }} defaultZoom={7}>
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `calc(100vh - 220px)` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withGoogleMap
)(MapWithADirectionsRenderer);
