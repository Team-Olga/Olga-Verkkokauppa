import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "/imports/plugins/core/ui/client/components";

class SupplierProductsListItem extends Component {

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
        console.log("Avoinna-nappia klikattu");
        this.props.showContractModal(this.props.product, 7);
    }

    handleOrdersClick(e) {
        e.preventDefault;
        console.log("Tilauksia-nappia klikattu");
    }

    handleOrderCountClick(e) {
        e.preventDefault();
        console.log("Tilattu-nappia klikattu");
    }

    handleContractedCountClick(e) {
        e.preventDefault();
        console.log("Sovittu-nappia klikattu");
    }

    handleSuppliedCountClick(e) {
        e.preventDefault();
        console.log("Toimitettu-nappia klikattu");
    }
   
    // two order-related buttons shown to admins only
    render() {
        return(
            <div className="row supplier-product-row">
                <a href={this.props.productStat.detailsHref}><span className="olga-listing-title">{this.props.productStat.title}</span></a>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                    onClick={this.handleSuppliedCountClick}>
                    Toimitettu {this.props.productStat.sentQuantity}
                </Button>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                    onClick={this.handleContractedCountClick}>
                    Sovittu {this.props.productStat.contractedQuantity}
                </Button>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-success pull-right"
                    onClick={this.handleOpenOrdersClick} data-productId={this.props.productStat.productId} >

                    Avoinna {this.props.productStat.openQuantity}
                </Button>
                {this.props.userStatus == "admin" && 
                    <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                        onClick={this.handleOrderCountClick}>
                        Tilattu {this.props.productStat.orderQuantity}
                    </Button>
                }
                {this.props.userStatus == "admin" && 
                    <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                        onClick={this.handleOrdersClick}>
                        Tilauksia {this.props.productStat.orderCount}
                    </Button>
                }
            </div>
        );
    }
}

SupplierProductsListItem.propTypes = {
    // product: PropTypes.object,
    // orders: PropTypes.arrayOf(PropTypes.object),
    productStat: PropTypes.object,
    userStatus: PropTypes.string,
    showContractModal: PropTypes.func,
};

export default SupplierProductsListItem;