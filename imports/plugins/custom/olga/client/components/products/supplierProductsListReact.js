import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import SupplierProductsListItem from "./supplierProductsListItem";
import { SortableTable } from "/imports/plugins/core/ui/client/components";
import { Products } from "/lib/collections";

class SupplierProductsListReact extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.products);
        const columns= [
            { 
                Header: "", 
                accessor: "title",
                Cell: cellInfo => (
                    <SupplierProductsListItem product={cellInfo.original} orders={this.props.orders}/>
                )
            }
        ];
        return (   
            <div>
                <ReactTable
                    data={this.props.products}
                    columns={columns}
                />
            </div>
        );
    }
}

SupplierProductsListReact.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object)
}

export default SupplierProductsListReact;