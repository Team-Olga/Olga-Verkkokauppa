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

    /**
     * orderCount
     * @summary Returns the number of customer orders where a given product has been ordered.
     * The number is an all-time figure, not e.g. for open orders only.
     * @param {Array} orders Array of all customer orders.
     * @param {Object} product Product in which we are interested in.
     * @return {Number} The number of orders containing the given product.
     */
    orderCount(orders, product) {
        let orderArray = _.filter(
            orders,
            function(o) {
                let match = false;
                _.forEach(o.items, function(item) {
                    if(item.variants._id == product._id) {
                        match = true;
                    }
                });
               return match;
            }
        )
        return orderArray.length;
    }

    /**
     * orderQuantity
     * @summary Returns the quantity of product that has been ordered (all-time, not just open orders).
     * @param {Array} orders Array of all customer orders.
     * @param {Object} product Product in which we are interested in.
     * @return {Number} The quantity of product ordered.
     */
    orderQuantity(orders, product) {
        let count = 0;
        _.forEach(
            orders,
            function(o) {
                _.forEach(o.items, function(item) {
                    if(item.variants._id == product._id) {
                        count += item.quantity;
                    }
                });
            }
        )
        return count;
    }

    /**
     * openOrderQuantity
     * @summary Returns the quantity of product that has been ordered in open orders (i.e. orders
     * where at least part of the order quantity hasn't been contracted with suppliers yet.
     * @param {Array} orders Array of all customer orders.
     * @param {Object} product Product in which we are interested in.
     * @return {Number} The quantity of product ordered in currently open orders.
     */
    openOrderQuantity(orders, product) {
        return 0;
    }

    /**
     * contractedQuantity
     * @summary Returns the quantity of product that has been contracted by suppliers 
     * but hasn't been received at the store yet.
     * @param {Object} product Product in which we are interested in.
     * @return {Number} The quantity of product contracted for but not yet reveiced.
     */
    contractedQuantity(product) {
        return 0;
    }

    /**
     * suppliedQuantity
     * @summary Returns the quantity of product that has been reported as having been sent 
     * by the suppliers but hasn't been received at the store yet.
     * @param {Object} product Product in which we are interested in.
     * @return {Number} The quantity of product reported as having been sent but that hasn't been
     * received at the store yet.
     */
    suppliedQuantity(product) {
        return 0;
    }

    /** productLink
     * @summary Returns a route to the details page of the given product.
     * @param {Object} product Product whose details we want to show.
     * @return {String} Route to the product details page.
     */
    productLink(product) {
        if(_.isEmpty(product.ancestors)) {
            return "/product/" + product.handle;
        // } else {
        //     let ancestor = 
        //     return "/product/" + product.handle + "/" + product.ancestors[0]._id;
        }
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
                <a href={this.productLink(this.props.product)}><span className="olga-listing-title">{this.props.product.title}</span></a>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                    onClick={this.handleSuppliedCountClick}>
                    Toimitettu {this.suppliedQuantity(this.props.product)}
                </Button>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                    onClick={this.handleContractedCountClick}>
                    Sovittu {this.contractedQuantity(this.props.product)}
                </Button>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-success pull-right"
                    onClick={this.handleOpenOrdersClick}>
                    Avoinna {this.openOrderQuantity(this.props.orders, this.props.product)}
                </Button>
                {this.props.userStatus == "admin" && 
                    <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                        onClick={this.handleOrderCountClick}>
                        Tilattu {this.orderQuantity(this.props.orders, this.props.product)}
                    </Button>
                }
                {this.props.userStatus == "admin" && 
                    <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                        onClick={this.handleOrdersClick}>
                        Tilauksia {this.orderCount(this.props.orders, this.props.product)}
                    </Button>
                }
            </div>
        );
    }
}

SupplierProductsListItem.propTypes = {
    product: PropTypes.object,
    orders: PropTypes.arrayOf(PropTypes.object),
    userStatus: PropTypes.string,
    showContractModal: PropTypes.func,
};

export default SupplierProductsListItem;