import React from "react";
import "./style.sass";

export default class Info extends React.Component {
  render() {
    console.log(this.props.stations);
    return this.props.stations.map(station => (
      <div key={station.Id}>
        {station.Nazwa_dworca}
        <ul>
          {station.Przewijak && <li>Posiada przewijak</li>}
          {station.Usługa_asysty && <li>Posiada usługę asysty</li>}
          {station[
            "Dojście_na_peron_przy_udziale_pracownika(osoby_udzielającej_pomocy)_w_ramach_zgłoszenia_przejazdu_48h"
          ] && (
            <li>
              Posiada usługę pomocy z uprzedzeniem 48h
              <br />
              <a className="link-dark" href="">
                Zgłoś prośbę tutaj
              </a>
            </li>
          )}
        </ul>
      </div>
    ));
  }
}
