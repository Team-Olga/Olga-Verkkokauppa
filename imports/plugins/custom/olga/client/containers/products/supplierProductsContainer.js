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
        // if(isInRole("admin")) {
            return (            
                <div>
                    <h1 className="olga-list-header">Tuotteet</h1>
                    <SupplierProductsListReact
                        products={this.props.products}
                        orders={this.props.orders}
                        userStatus={userStatus}
                    />
                </div>            
            );
        // }

        // if(isInRole("supplierproductsreact")) {
        //     return (            
        //         <div>
        //             <h1>Olet tuottaja!</h1>
        //             <h1 className="olga-list-header">Tuotteet</h1>
        //             <SupplierProductsListReact
        //                 products={this.props.products}
        //                 orders={this.props.orders}
        //                 userStatus="supplier"
        //             />
        //         </div>           
        //     );
        // }

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
        onData(null, {
            products: Products.find({}, { sort: { createdAt: 1 }}).fetch(),
            orders: Orders.find({}, { sort: { createdAt: 1 }}).fetch()
        });
    }
}

export default composeWithTracker(loadData, Loading)(SupplierProductsContainer);