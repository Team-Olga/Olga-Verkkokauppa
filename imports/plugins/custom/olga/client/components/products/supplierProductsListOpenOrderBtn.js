import React, { Component } from "react";
import { Button } from "/imports/plugins/core/ui/client/components";

export default class SupplierProductsListOpenOrderBtn extends Component {
  constructor(props) {
    super(props);

    this.handleOpenOrdersClick = this.handleOpenOrdersClick.bind(this);
  }

  handleOpenOrdersClick(e) {
    e.preventDefault();
    this.props.showContractModal(
      this.props.productStat.productId,
      this.props.productStat.title,
      this.props.productStat.openQuantity
    );
  }

  render() {
    return (
      <Button status="primary" bezelStyle="flat" className="olga-listing-btn-success pull-right"
        onClick={this.handleOpenOrdersClick} data-productId={this.props.productStat.productId}
      >

        Avoinna {this.props.productStat.openQuantity}
      </Button>
    );
  }
}
