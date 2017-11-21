import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "/imports/plugins/core/ui/client/components";

class ContractListItem extends Component {
  constructor(props) {
    super(props);

    this.handleCancelContractClick = this.handleCancelContractClick.bind(this);
    this.handleSuppliedCountClick = this.handleSuppliedCountClick.bind(this);
  }

  handleCancelContractClick(e) {
    e.preventDefault();
  }

  handleSuppliedCountClick(e) {
    e.preventDefault();
  }

  render() {
    const totals = this.props.contractTotals;
    const util = require('util');
    console.log('totals: ' + util.inspect(totals, false, null));
    return (           
      <div className="row supplier-product-row">
        <span className="product-name"> Tuote: {totals.product.title} </span>
        <span className="contract-total"> Tuotannossa: {totals.production} </span>
        <span className="contract-total"> Lähetetty: {totals.delivery} </span>
        <span className="contract-total"> Vastaanotettu: {totals.received} </span>
      </div>
    );
  }
}

ContractListItem.propTypes = {
    contract: PropTypes.object,
    userStatus: PropTypes.string
};

export default ContractListItem;