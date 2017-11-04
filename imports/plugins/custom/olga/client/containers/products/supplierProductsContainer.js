import React, { Component } from "react";
import { Tracker } from "meteor/tracker";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";;
import _ from "lodash";
import { isInRole, getAllRoles } from "../../../lib/userChecks";
import { Products, Orders } from "lib/collections";
import { Loading } from "/imports/plugins/core/ui/client/components";
import SupplierProductsListReact from "../../components/products/supplierProductsListReact";

class SupplierProductsContainer extends Component {
    static propTypes = {
        products: PropTypes.array,
        orders: PropTypes.array,
        productStats: PropTypes.array
    }

    constructor(props) {
        super(props);
    }

    render() {
        if (_.isEmpty(this.props.products)) {
            return (
                <div>
                    <p>Tuotteita ei löytynyt!</p>
                </div>
            );
        }
        
        let userStatus;
        if(isInRole("admin")) {
            userStatus = "admin";
        }
        else if(isInRole("supplierproductsreact")) {
            userStatus = "supplier";
        }

        return (            
            <div>
                <h1 className="olga-list-header">Tuotteet</h1>
                <SupplierProductsListReact
                    products={this.props.products}
                    orders={this.props.orders}
                    productStats={this.props.productStats}
                    userStatus={userStatus}
                />
            </div>            
        );

        let userRoles = getAllRoles();
        return (
            <div>
                <h1>Ei admin-oikeuksia!</h1>
                <h3>Käyttäjän roolit:</h3>
                <p>{userRoles}</p>
            </div>
        )
    }
}

const loadData = (props, onData) => {
    const productsSubscription = Meteor.subscribe("Products");
    const ordersSubscription = Meteor.subscribe("Orders");

    if(productsSubscription.ready() && ordersSubscription.ready()) {
        const allProducts = Products.find({}, { sort: { createdAt: 1 }}).fetch();
        const allOrders = Orders.find({}, { sort: { createdAt: 1 }}).fetch();
        const productStats = getProductStats(allOrders, allProducts);


        onData(null, {
            products: allProducts,
            orders: allOrders,
            productStats: productStats
        });
    }
}

function getProductStats(orders, products) {
    let productStats = [];

    _.forEach(products, function(product) {
        let productStat = {};
        productStat.title = product.title;
        productStat.detailsHref = "#";
        productStat.productId = product._id;
        productStat.orderCount = orderCount(orders, product._id);
        productStat.orderQuantity = orderQuantity(orders, product._id);
        productStat.openQuantity = openQuantity(orders, product._id);
        productStat.contractedQuantity = 0;
        productStat.sentQuantity = 0;
        
        productStats.push(productStat);
    });

    return productStats;
}

function orderCount(orders, productId) {
    let orderArray = _.filter(
        orders,
        function(o) {
            let match = false;
            _.forEach(o.items, function(item) {
                if(item.variants._id == productId) {
                    match = true;
                }
            });
           return match;
        }
    )
    return orderArray.length;
}

function orderQuantity(orders, productId) {
    let count = 0;
    _.forEach(
        orders,
        function(o) {
            _.forEach(o.items, function(item) {
                if(item.variants._id == productId) {
                    count += item.quantity;
                }
            });
        }
    )
    return count;
}

function openQuantity(orders, productId) {
    let openQuantity = 0;
    _.forEach(
        orders,
        function(o) {
            _.forEach(o.productSupplies, function(productSupply) {
                console.log("Order: "  + o._id + " / productId " + productSupply.productId + " " + productSupply.openQuantity + " kpl");
                if(productSupply.productId == productId) {
                    console.log("Matches");
                    openQuantity += productSupply.openQuantity;
                } else {
                    console.log("Doesn't match");
                }
            });
        }
    );
    return openQuantity;
}

export default composeWithTracker(loadData, Loading)(SupplierProductsContainer);