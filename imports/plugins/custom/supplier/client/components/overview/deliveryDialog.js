import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";

import { ProductImage } from "@olga/olga-ui";

import './styles.less';

class DeliveryDialog extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      deliveryQuantity: 0
    };

    this.closeDialog = this.closeDialog.bind(this);
    this.updateDeliveryQuantity = this.updateDeliveryQuantity.bind(this);
  }

  updateDeliveryQuantity(e) {
    if (Number.isNaN(e.target.value) || !Number.isInteger(Number(e.target.value))) {
      this.props.showAlert("Toimitusmäärän on oltava kokonaisluku", "error");
    } else if (Number(e.target.value) > this.props.contractQuantity) {
      this.props.showAlert("Voit toimittaa enintään sovitun määrän", "error");
    } else if (Number(e.target.value) <= 0) {
      this.props.showAlert("Toimitusmäärän on oltava positiivinen luku", "error");
    } else {
      this.setState({ deliveryQuantity: e.target.value });
    }
  }

  closeDialog(cancelled) {
    if (cancelled || this.state.deliveryQuantity == 0 || this.props.contractQuantity <= 0) {
      this.props.closeSideView();
    } else {      
      Meteor.call(
        "deliveries/create", 
        this.props.productId, 
        parseInt(this.state.deliveryQuantity),
        (error, result) => {
          if(error) {            
            this.props.showAlert("Toimitusilmoituksen teko ei onnistunut!", "error");
          } else {
            this.props.showAlert(
              "Toimitusilmoitus tehty (" + 
              this.props.productName  + " " +
              this.props.variantName  + " " +
              this.state.deliveryQuantity + " kpl)",
              "success");
            this.props.closeSideView(); 
          }
        }
      );           
    }
  }

  render() {

    return (
      <div>
        <div className="olga-dialogpanel" style={{ fontSize: '14px' }}>
          <h3 id="deliveryModalTitle">{this.props.productName} - {this.props.variantName}</h3>
          <br />
          <div className="panel-info-container" style={{display:"flex"}}>
            <ProductImage style={{flex: "auto"}} item={{ 
              _id: this.props.simpleId,  
              variantId: this.props.productId 
            }} styles={{maxWidth: '50%'}}/>
            <div className="panel-options" style={{flex: "auto"}}>
              <table>
                <tbody>
                  <tr>
                    <td className="olga-dialogpanel-cell">Sovittu määrä</td>
                    <td className="olga-dialogpanel-cell pull-right">{this.props.contractQuantity}</td>
                  </tr>
                  <tr>
                    <td className="olga-dialogpanel-cell">Toimitettava määrä</td>
                    <td className="olga-dialogpanel-cell">
                      <input type="number" id="quantity" name="quantity" className="right-justified" min="0" max={this.props.contractQuantity}
                        onChange={this.updateDeliveryQuantity} value={this.state.deliveryQuantity}
                        style={{border: 'none', borderBottom: '1px solid #738690'}}/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="olga-dialogpanel">
              <button id="cancelDelivery" className="rui btn btn-primary flat olga-listing-btn-default pull-right"
                  onClick={() => this.closeDialog("cancel")} >Peruuta</button>
              <button id="confirmDelivery" className="rui btn btn-primary flat olga-listing-btn-success pull-right"
                  onClick={() => this.closeDialog()} >Vahvista</button>
          </div>
        </div>
      </div>
    );
  }

}

DeliveryDialog.propTypes = {
  productId: PropTypes.string,
  productName: PropTypes.string,
  variantName: PropTypes.string,
  contractQuantity: PropTypes.number,
  closeSideView: PropTypes.func,
  showAlert: PropTypes.func
}

export default DeliveryDialog;