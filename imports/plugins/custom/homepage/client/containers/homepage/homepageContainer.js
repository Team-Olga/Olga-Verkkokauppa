import React, { Component } from 'react';
import HomepageComponent from "../../components/homepage/homepageComponent";

export default class HomepageContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Tervetuloa Olga-Verkkokauppaan!</h1>
        <HomepageComponent />
      </div>
    );
  }
}
