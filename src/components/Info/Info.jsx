import React from "react";
import "./style.sass";

const chosen_polish_keys = {
  // Kasa_dla_PRM: {
  //   text: "Kasa dla PRM",
  //   namePath: "CASH_REG_FOR_DISABILITIES.jpg"
  // },
  Pętla_indukcyjna_w_kasie: {
    text: "Pętla indukcyjna w kasie",
    namePath: "INDUCTION_LOOP_IN_CASH_REG.jpg"
  },
  Interkom: {
    text: "Interkom",
    namePath: "INTERCOM.jpg"
  },
  Wszysc_przewoźnicy_w_kasie: {
    text: "Wszyscy przewoźnicy w kasie",
    namePath: "ALL_CARRIERS_TICKET_OFFICE.jpg"
  },
  Język_migowy_w_Infodworcu: {
    text: "Język migowy w Infodworcu",
    namePath: "SIGN_LANGUAGE_INFO_STATION.jpg"
  },
  Język_migowy_w_kasie: {
    text: "Język migowy w kasie",
    namePath: "SIGN_LANGUAGE_CASH_REG.jpg"
  },
  Urządzenia_wspomagające: {
    text: "Urządzenia wspomagające",
    namePath: "SUPPORTING_DEVICES.jpg"
  },
  WC: {
    text: "WC",
    namePath: "WC.jpg"
  },
  Usługa_asysty: {
    text: "Usługa asysty",
    namePath: "ASSISTANT_SERVICE.jpg"
  },
  Mapa_dotykowa: {
    text: "Mapa dotykowa",
    namePath: "TOUCH_MAP.jpg"
  },
  Parking_: {
    text: "P+R,stacje postojowe",
    namePath: "P_R_SPACE.jpg"
  },
  Oznakowania_poziome: {
    text: "Oznakowania poziome",
    namePath: "HORIZONTAL_MARKINGS.jpg"
  },
  Przewijak: {
    text: "Przewijak",
    namePath: "CHANGING.jpg"
  },
  Pokój_opiekuna: {
    text: "Pokój opiekuna",
    namePath: "GUARDIAN_ROOM.jpg"
  }
};

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

      const stationInfo = Object.keys(station)
        .filter(key => Boolean(station[key]))
        .map(key => chosen_polish_keys[key])
        .filter(station => Boolean(station));
      console.log(stationInfo);

      return (
        <div key={station.Id} className="Info">
          <div className="Info__station">
            <span className="Info__time">{station.time.text}</span>
            {station.Nazwa_dworca}
          </div>

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
            <ul className="Info__list">
              {Boolean(kasa_prm) && (
                <li className="Info__list-item">
                  <div className="Info__list-img" />
                  <span className="Info__list-text">Kasa PRM</span>
                </li>
              )}
              {stationInfo.map(info => {
                return (
                  <li className="Info__list-item">
                    <img
                      className="Info__list-img"
                      src={"/" + info.namePath}
                      alt={info.text}
                    />
                    <span className="Info__list-text">{info.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    });
  }
}
