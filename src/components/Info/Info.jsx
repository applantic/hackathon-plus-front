import React from "react";
import "./style.sass";

export default class Info extends React.Component {
  state = {
    isOpen: []
  };

  render() {
    console.log(this.props.stations);
    return this.props.stations.map((station, s_index) => {
      const a =
        station[
          "Dojście_na_pero_w_poziomie_szyn_z_asystą_opiekuna_lub_osoby_towarzyszącej"
        ];
      const b =
        station[
          "Dojście_na_peron_przy_udziale_pracownika(osoby_udzielającej_pomocy)_w_ramach_zgłoszenia_przejazdu_48h"
        ];
      const c = station["Dostęp_na_peron_za_pomocą_platformy_przyschodowej"];
      const d = station["Dostęp_na_peron_za_pomocą_pochylni_podjazdu"];
      const e = station["Dostęp_na_peron_za_pomocą_windy_platformy_pionowej"];
      const kasa_migowy = station["Język_migowy_w_kasie"];
      const kasa_prm = station["Kasa_dla_PRM"];
      const pokoj_opiekuna = station["Pokój_opiekuna"];
      const przewijak = station["Przewijak"];
      const usluga_asysty = station["Usługa_asysty"];
      const wc = station["WC"];
      const infodworzec = station["Infodworzec"];
      const oznakowania = station["Oznakowania_poziome"];

      return (
        <div key={station.Id}>
          {station.Nazwa_dworca}

          <div
            className="Info__expand"
            onClick={() =>
              this.setState({
                isOpen: this.state.isOpen.includes(s_index)
                  ? this.state.isOpen.filter(a => a !== s_index)
                  : [...this.state.isOpen, s_index]
              })
            }
          >
            {this.state.isOpen.includes(s_index) ? "Ukryj" : "Pokaż"}{" "}
            udogodnienia
          </div>
          <div
            className={`Info__details && ${this.state.isOpen.includes(
              s_index
            ) && "Info__details--open"}`}
          >
            <ul>
              {przewijak && <li>Posiada przewijak</li>}
              {usluga_asysty && <li>Posiada usługę asysty</li>}
              {a && (
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
        </div>
      );
    });
  }
}
