import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";

import AlertContainer from "react-alert";

import './styles.less';

class ContractDialog extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      supplyQuantity: 0
    };
  }

  updateSupplyQuantity(e) {
    if (Number.isNaN(e.target.value) || !Number.isInteger(Number(e.target.value))) {
      this.showAlert("Toimitusmäärän on oltava kokonaisluku", "error");
    } else if (Number(e.target.value) > this.props.openQuantity) {
      this.showAlert("Voit toimittaa enintään avoinna olevan määrän", "error");
    } else {
      this.setState({ supplyQuantity: e.target.value });
    }
  }

  closeContractModal(cancelled) {
    if (cancelled || this.state.supplyQuantity == 0 || this.props.openQuantity <= 0) {
      this.setState({ contractModalIsOpen: false }); // TODO sulje sideview
    } else {
      const contractId = Meteor.call("supplyContracts/create", this.props.productId, parseInt(this.state.supplyQuantity));
      this.showAlert("Toimitussopimus tehty (" + this.state.productName + " " + this.state.supplyQuantity + " kpl)", "success");
    }
  }

  alertOptions = {
    offset: 14,
    position: "top left",
    theme: "light",
    time: 5000,
    transition: "scale"
  }

  showAlert = (message, type) => {
    this.msg.show(message, {
      time: 5000,
      type: type
    });
  }

  render() {

    return (
      <div>
        <h1>Tee toimitussopimus</h1>
        <h2 id="contractModalTitle">{this.props.productName}</h2>
        <h3>Avoin määrä: <span id="openQuantity">{this.props.openQuantity}</span> </h3>
        <h3><label htmlFor="quantity">Toimitettava määrä: </label>
        <input type="number" id="quantity" name="quantity" className="right-justified" min="0" max={this.props.openQuantity}
            onChange={this.updateSupplyQuantity} value={this.state.supplyQuantity}/></h3>
        <div>
            <button id="cancelContractModal" className="rui btn btn-primary flat olga-listing-btn-default pull-right"
                onClick={() => this.closeContractModal("cancel")} >Peruuta</button>
            <button id="confirmContract" className="rui btn btn-primary flat olga-listing-btn-success pull-right"
                onClick={() => this.closeContractModal()} >Vahvista</button>
        </div>
      </div>
    );
  }

}

ContractDialog.propTypes = {
  productId: PropTypes.string,
  productName: PropTypes.string,
  openQuantity: PropTypes.number
}

export default ContractDialog;