import React, { Component } from "react";
import PropTypes from "prop-types";;
import _ from "lodash";
//import { composeWithTracker } from "/lib/api/compose";
//import { Loading } from "/imports/plugins/core/ui/client/components";
//import { Products, Orders } from "lib/collections";
import SupplierProductsListReact from "../../components/products/supplierProductsListReact";

class SupplierProductsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [
                { title: "Tuote 1" },
                { title: "Tuote 2"}
            ],
            orders: []
        };
        console.log("creating SupplierProductsContainer");
    }

    render() {
        console.log("rendering SupplierProductsContainer");
        console.log(SupplierProductsListReact);
        if (_.isEmpty(this.state.products)) {
            return (
                <div>
                    <p>Tuotteita ei löytynyt!</p>
                </div>
            );
        }
        
        return (            
            <div>
                <h1>SupplierProductsContainer exists!</h1>
                <SupplierProductsListReact
                    products={this.state.products}
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