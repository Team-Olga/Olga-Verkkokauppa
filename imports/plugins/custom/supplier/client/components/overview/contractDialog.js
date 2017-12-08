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

    this.closeDialog = this.closeDialog.bind(this);
    this.updateSupplyQuantity = this.updateSupplyQuantity.bind(this);
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

  closeDialog(cancelled) {
    if (cancelled || this.state.supplyQuantity == 0 || this.props.openQuantity <= 0) {
      this.props.closeSideView();
    } else {
      console.log("Kutsutaan metodia: " + this.props.productId + " / " + parseInt(this.state.supplyQuantity) + " kpl")
      const contractId = Meteor.call("supplyContracts/create", this.props.productId, parseInt(this.state.supplyQuantity));
      this.showAlert(
        "Toimitussopimus tehty (" + 
        this.props.productName  + " " +
        this.props.variantName  + " " +
        this.state.supplyQuantity + " kpl)",
         "success");
      this.props.closeSideView();
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
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

        <div className="olga-dialogpanel">
          <h2>Tee toimitussopimus</h2>
          <h3 id="contractModalTitle">{this.props.productName} {this.props.variantName}</h3>
          <br />
          <table>
            <tbody>
              <tr>
                <td className="olga-dialogpanel-cell">Avoin määrä</td>
                <td className="olga-dialogpanel-cell pull-right">{this.props.openQuantity}</td>
              </tr>
              <tr>
                <td className="olga-dialogpanel-cell">Toimitettava määrä</td>
                <td className="olga-dialogpanel-cell">
                  <input type="number" id="quantity" name="quantity" className="right-justified" min="0" max={this.props.openQuantity}
                    onChange={this.updateSupplyQuantity} value={this.state.supplyQuantity}/>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="olga-dialogpanel">
              <button id="cancelContract" className="rui btn btn-primary flat olga-listing-btn-default pull-right"
                  onClick={() => this.closeDialog("cancel")} >Peruuta</button>
              <button id="confirmContract" className="rui btn btn-primary flat olga-listing-btn-success pull-right"
                  onClick={() => this.closeDialog()} >Vahvista</button>
          </div>
        </div>
      </div>
    );
  }

}

ContractDialog.propTypes = {
  productId: PropTypes.string,
  productName: PropTypes.string,
  variantName: PropTypes.string,
  openQuantity: PropTypes.number,
  closeSideView: PropTypes.func
}

export default ContractDialog;