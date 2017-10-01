import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "/imports/plugins/core/ui/client/components";

class SupplierProductsListItem extends Component {

    constructor(props) {
        super(props);
    }

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

    openOrderQuantity(orders, product) {
        return 0;
    }

    render() {
        return(
            <div className="row supplier-product-row">
                <span className="listingtitle">{this.props.product.title}</span>
                <Button status="primary" className="pull-right listing-button">Avoinna {this.openOrderQuantity(this.props.orders, this.props.product)}</Button>
                <Button status="primary" className="pull-right listing-button">Tilattu {this.orderQuantity(this.props.orders, this.props.product)}</Button>
                <Button status="primary" className="pull-right listing-button">Tilauksia {this.orderCount(this.props.orders, this.props.product)}</Button>
            </div>
        );
    }
}

SupplierProductsListItem.propTypes = {
    product: PropTypes.object
};

export default SupplierProductsListItem;