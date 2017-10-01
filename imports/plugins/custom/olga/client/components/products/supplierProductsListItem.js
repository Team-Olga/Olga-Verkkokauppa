import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "/imports/plugins/core/ui/client/components";

class SupplierProductsListItem extends Component {

    constructor(props) {
        super(props);
    }

    orderCount() {
        let orderArray = _.filter(
            this.props.orders,
            function(o) {
                let match = false;
                _.forEach(o.items, function(item) {
                    if(item.variants._id == this.props.product._id) {
                        match = true;
                    }
                });
               return match;
            }
        )
        return orderArray.length;
    }

    orderQuantity() {
        let count = 0;
        _.forEach(
            this.props.orders,
            function(o) {
                _.forEach(o.items, function(item) {
                    if(item.variants._id == this.props.product._id) {
                        count += item.quantity;
                    }
                });
            }
        )
        return count;
    }

    openOrderQuantity() {
        return 7;
    }

    render() {
        return(
            <div className="row">
                <span className="listingtitle">{this.props.product.title}</span>
                <Button status="primary" className="pull-right">Avoinna {this.openOrderQuantity()}</Button>
                <Button status="primary" className="pull-right">Tilattu {this.orderQuantity()}</Button>
                <Button status="primary" className="pull-right">Tilauksia {this.orderCount()}</Button>
            </div>
        );
    }
}

SupplierProductsListItem.propTypes = {
    product: PropTypes.object
};

export default SupplierProductsListItem;