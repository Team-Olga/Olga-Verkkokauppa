import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";

import { ProductImage } from "@olga/olga-ui";

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
      this.props.showAlert("Toimitusmäärän on oltava kokonaisluku", "error");
    } else if (Number(e.target.value) > this.props.openQuantity) {
      this.props.showAlert("Voit toimittaa enintään avoinna olevan määrän", "error");
    } else if (Number(e.target.value) <= 0) {
      this.props.showAlert("Toimitusmäärän on oltava positiivinen luku", "error");
    } else {
      this.setState({ supplyQuantity: e.target.value });
    }
  }

  closeDialog(cancelled) {
    if (cancelled || this.state.supplyQuantity == 0 || this.props.openQuantity <= 0) {
      this.props.closeSideView();
    } else {
      Meteor.call(
        "supplyContracts/create", 
        this.props.productId, 
        parseInt(this.state.supplyQuantity),
        (error, result) => {
          if(error) {            
            this.props.showAlert("Toimitussopimuksen teko ei onnistunut!", "error");
          } else {
            this.props.showAlert(
              "Toimitussopimus tehty (" + 
              this.props.productName  + " " +
              this.props.variantName  + " " +
              this.state.supplyQuantity + " kpl)",
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
          <h3 id="contractModalTitle">{this.props.productName} - {this.props.variantName}</h3>
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
                    <td className="olga-dialogpanel-cell">Avoin määrä</td>
                    <td className="olga-dialogpanel-cell pull-right">{this.props.openQuantity}</td>
                  </tr>
                  <tr>
                    <td className="olga-dialogpanel-cell">Toimitettava määrä</td>
                    <td className="olga-dialogpanel-cell">
                      <input type="number" id="quantity" name="quantity" className="right-justified" min="0" max={this.props.openQuantity}
                        onChange={this.updateSupplyQuantity} value={this.state.supplyQuantity}
                        style={{border: 'none', borderBottom: '1px solid #738690'}}/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
  closeSideView: PropTypes.func,
  showAlert: PropTypes.func
}

export default ContractDialog;