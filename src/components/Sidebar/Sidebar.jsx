import React from "react";
import "./style.sass";

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className={`Sidebar ${this.props.isOpen ? "Sidebar--open" : ""}`}>
        <label className="Sidebar__handle" aria-hidden>
          <input
            hidden
            checked={this.props.isOpen}
            type="checkbox"
            onChange={e => {
              this.props.onChange && this.props.onChange(!this.props.isOpen);
            }}
          />
        </label>
        <div className="Sidebar__content">{this.props.children}</div>
      </div>
    );
  }
}
