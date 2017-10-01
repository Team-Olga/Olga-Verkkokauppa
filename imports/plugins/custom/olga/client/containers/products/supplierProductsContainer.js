import React, { Component } from "react";
import { Tracker } from "meteor/tracker";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";;
import _ from "lodash";
import { Products, Orders } from "lib/collections";
import SupplierProductsListReact from "../../components/products/supplierProductsListReact";

class SupplierProductsContainer extends Component {
    constructor(props) {
        super(props);
        // let products = [];
        // for(var i = 1; i <= 1000; i++)
        //     products.push({ title: "Tuote " + i});
        // this.state = {
        //     products: products,
        //     orders: []
        // };
        this.products = ReactiveVar();
        this.orders = ReactiveVar();

        Tracker.autorun(() => {
            Meteor.subscribe("Products");
            Meteor.subscribe("Orders");
            const productSet = Products.find({}, { sort: { createdAt: 1 } });
            const orderSet = Orders.find({}, { sort: { createdAt: 1 } });
            this.products.set(productSet.fetch());
            this.orders.set(orderSet.fetch());
            this.state = {
                products: this.products.get(),
                orders: this.orders.get()    
            }; 
        });
    }

    render() {
        if (_.isEmpty(this.state.products)) {
            return (
                <div>
                    <p>Tuotteita ei löytynyt!</p>
                </div>
            );
        }
        
        return (            
            <div>
                <h1>Tuotelista</h1>
                <SupplierProductsListReact
                    products={this.state.products}
                    orders={this.state.orders}
                />
            </div>            
        );
    }
}

SupplierProductsContainer.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object),
    orders: PropTypes.arrayOf(PropTypes.object)
}

export default SupplierProductsContainer;