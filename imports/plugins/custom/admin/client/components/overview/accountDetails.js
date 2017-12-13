import React, { Component } from "react";
import PropTypes from "prop-types";


class AccountDetails extends Component {
  static propTypes = {
    supplier: PropTypes.object,
  }

  render() {
    const addressBook = this.props.supplier.profile.addressBook[0];

    return (
      <div className="account-details">
        <div className="account-info" style={{ marginTop: "0px" }}>
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
      </div>
    );
  }
}

export default AccountDetails;