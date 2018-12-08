import React from "react";
import "./style.sass";

export default class Sidebar extends React.Component {
  state = { isOpen: false };

  render() {
    return (
      <div className={`Sidebar ${this.state.isOpen ? "Sidebar--open" : ""}`}>
        <label className="Sidebar__handle" aria-hidden>
          <input
            hidden
            checked={this.state.isOpen}
            type="checkbox"
            onChange={e => {
              this.setState({ isOpen: !this.state.isOpen });
            }}
          />
        </label>
        <div className="Sidebar__content">{this.props.children}</div>
      </div>
    );
  }
}
