import React, { Component } from "react";
import PropTypes from "prop-types";
import { Badge } from "@reactioncommerce/reaction-ui";


class AccountDetails extends Component {
  static propTypes = {
    supplier: PropTypes.object,
  }

  render() {
    const addressBook = this.props.supplier.profile.addressBook[0];

    return (
      <div className="account-details">
{/*        <div
          className="order-summary-form-group bg-info"
          style={{ lineHeight: 3, marginTop: -15, marginRight: -15, marginLeft: -15 }}
        >
          <strong style={{ marginLeft: 15 }}>{this.props.supplier.name}</strong>
          <div className="invoice-details" style={{ marginRight: 15, position: "relative" }}>
            {this.props.supplier.emails[0].address}
          </div>
        </div>

        <div className="order-summary-form-group">
          <strong data-i18n="orderShipping.shipTo">Ship to</strong>
          <div className="invoice-details">
            <strong>Phone: </strong>{profileShippingAddress.phone}
          </div>
        </div>*/}

        <div className="account-info" style={{ marginTop: 4 }}>
          <span>{addressBook.fullName}</span>
          <br/>
          <span>{addressBook.address1}</span>
          {addressBook.address2 && <span><br/>{addressBook.address2}</span>}
          <br/>
          <span>
            {addressBook.city}, {addressBook.region}, {addressBook.country} {addressBook.postal}
          </span>
        </div>

        <div className="account-phone">
          {addressBook.phone}
        </div>

 {/*       <div className="roll-up-invoice-list">
          <div className="roll-up-content">
            <div className="order-summary-form-group">
              <strong>Name</strong>
              <div className="invoice-details">
                {this.props.supplier.name}
              </div>
            </div>

            <div className="order-summary-form-group">
              <strong>Email</strong>
              <div className="invoice-details">
                {this.props.supplier.emails[0].address}
              </div>
            </div>

            <div className="order-summary-form-group">
              <strong>Address</strong>
              <div className="invoice-details">
                {addressBook.address1}
              </div>
            </div>

            <div className="order-summary-form-group">
              <strong>Phone</strong>
              <div className="invoice-details">
                {addressBook.phone}
              </div>
            </div>
          </div>
        </div>*/}
      </div>

    );
  }
}

export default AccountDetails;