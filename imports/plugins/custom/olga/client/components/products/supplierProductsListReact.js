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
        // const adminColumns = [
        //     { 
        //         Header: "", 
        //         accessor: "title",
        //         Cell: cellInfo => (
        //             <AdminProductsListItem product={cellInfo.original} orders={this.props.orders}/>
        //         )
        //     }
        // ];

        const supplierColumns = [
            { 
                Header: "", 
                accessor: "title",
                Cell: cellInfo => (
                    <SupplierProductsListItem 
                        product={cellInfo.original} 
                        orders={this.props.orders}
                        userStatus={this.props.userStatus}
                    />
                )
            }
        ];

        return (   
            <div>
                <ReactTable
                    data={this.props.products}
                    columns={supplierColumns}
                    defaultPageSize={10}
                    className="olga-list-table"
                />
            </div>
        );
    }
}

SupplierProductsListReact.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object),
    orders: PropTypes.arrayOf(PropTypes.object),
    userStatus: PropTypes.string
}

export default SupplierProductsListReact;