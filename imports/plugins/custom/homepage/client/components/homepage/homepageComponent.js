import React from "react";

export default class HomepageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <p>Tämä on testi!</p>
        <p>{this.props.haloo}</p>
      </div>
    );
  }
}
