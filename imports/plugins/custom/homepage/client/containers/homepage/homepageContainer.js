import React from "react";
import HomepageComponent from "../../components/homepage/homepageComponent";

export default class HomepageContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const juttu = "Haloo jeejee";
    return (
      <div>
        <h1>Tervetuloa Olga-Verkkokauppaan!</h1>
        <HomepageComponent haloo = {juttu}/>
      </div>
    );
  }
}
