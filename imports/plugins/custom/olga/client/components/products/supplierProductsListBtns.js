import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "/imports/plugins/core/ui/client/components";

export default class SupplierProductsListBtns extends Component {
  constructor(props) {
    super(props);

    this.handleOpenOrdersClick = this.handleOpenOrdersClick.bind(this);
    this.handleOrdersClick = this.handleOrdersClick.bind(this);
    this.handleOrderCountClick = this.handleOrderCountClick.bind(this);
    this.handleContractedCountClick = this.handleContractedCountClick.bind(this);
    this.handleSuppliedCountClick = this.handleSuppliedCountClick.bind(this);
  }

  handleOpenOrdersClick(e) {
    e.preventDefault();
    this.props.showContractModal(
      this.props.productStat.productId,
      this.props.productStat.title,
      this.props.productStat.openQuantity
    );
  }

  handleOrdersClick(e) {
    e.preventDefault();
  }

  handleOrderCountClick(e) {
    e.preventDefault();
  }

  handleContractedCountClick(e) {
    e.preventDefault();
    this.props.showDeliveryModal(
      this.props.productStat.productId,
      this.props.productStat.title,
      this.props.productStat.contractedQuantity
    );
  }

  handleSuppliedCountClick(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className="row supplier-product-row">
        <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
          onClick={this.handleSuppliedCountClick}
        >
          Toimitettu {this.props.productStat.sentQuantity}
        </Button>
        <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right contracted-btn"
          onClick={this.handleContractedCountClick}
        >
          Sovittu {this.props.productStat.contractedQuantity}
        </Button>
        <Button status="primary" bezelStyle="flat" className="olga-listing-btn-success pull-right"
          onClick={this.handleOpenOrdersClick} data-productId={this.props.productStat.productId}
        >
          Avoinna {this.props.productStat.openQuantity}
        </Button>
        {this.props.userStatus == "admin" &&
        <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
          onClick={this.handleOrderCountClick}
        >
          Tilattu {this.props.productStat.orderQuantity}
        </Button>
        }
        {this.props.userStatus == "admin" &&
           <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
              onClick={this.handleOrdersClick}
            >
              Tilauksia {this.props.productStat.orderCount}
            </Button>
         }
      </div>      
    );
  }
}

SupplierProductsListBtns.propTypes = {
  productStat: PropTypes.object,
  userStatus: PropTypes.string,
  showContractModal: PropTypes.func,
  showDeliveryModal: PropTypes.func
};

