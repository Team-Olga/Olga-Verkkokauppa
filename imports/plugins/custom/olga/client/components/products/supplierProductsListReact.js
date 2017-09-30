import React, { Component } from "react";
import PropTypes from "prop-types";
import SupplierProductsListItem from "./supplierProductsListItem";

class SupplierProductsListReact extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.products);
        return (   
            <div>
                {this.props.products.map((product, index) => (
                    <SupplierProductsListItem key={index} product={product} />
                ))}      
            </div>
        );
    }
}

SupplierProductsListReact.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object)
}

export default SupplierProductsListReact;