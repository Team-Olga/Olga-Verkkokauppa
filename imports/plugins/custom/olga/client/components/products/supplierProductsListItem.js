import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "/imports/plugins/core/ui/client/components";

class SupplierProductsListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row supplier-product-row">
        <a href={this.props.productStat.detailsHref}><span className="olga-listing-title">{this.props.productStat.title}</span></a>
      </div>
    );
  }
}

SupplierProductsListItem.propTypes = {
  productStat: PropTypes.object,
  userStatus: PropTypes.string,
  showContractModal: PropTypes.func
};

export default SupplierProductsListItem;
