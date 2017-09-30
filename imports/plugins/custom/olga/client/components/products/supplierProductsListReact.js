import React, { Component } from "react";
import PropTypes from "prop-types";
import { SupplierProductsListItem } from "./supplierProductsListItem";

class SupplierProductsListReact extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // <div>
            //     {this.props.products.map(function(product){
            //         return <SupplierProductsListItem product={product} />
            //     })}

            //     <SupplierProductsListItem
            //         {...this.props}
            //     />
            // </div>
            <div>
                <p>
                SupplierProductsListReact
                </p>
            </div>
        );
    }
}

// SupplierProductsListReact.propTypes = {
    
// }

export default SupplierProductsListReact;