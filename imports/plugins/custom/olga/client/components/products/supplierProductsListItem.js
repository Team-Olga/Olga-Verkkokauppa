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

    productLink(product) {
        if(_.isEmpty(product.ancestors)) {
            return "/product/" + product.handle;
        // } else {
        //     let ancestor = 
        //     return "/product/" + product.handle + "/" + product.ancestors[0]._id;
        }
    }

    render() {
        return(
            <div className="row supplier-product-row">
                <a href={this.productLink(this.props.product)}><span className="olga-listing-title">{this.props.product.title}</span></a>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-success pull-right">
                    Avoinna {this.openOrderQuantity(this.props.orders, this.props.product)}
                </Button>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right">
                    Tilattu {this.orderQuantity(this.props.orders, this.props.product)}
                </Button>
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right">
                    Tilauksia {this.orderCount(this.props.orders, this.props.product)}
                </Button>
            </div>
        );
    }
}

SupplierProductsListItem.propTypes = {
    product: PropTypes.object
};

export default SupplierProductsListItem;