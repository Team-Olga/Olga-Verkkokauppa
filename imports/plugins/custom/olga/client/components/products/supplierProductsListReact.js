import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import SupplierProductsListItem from "./supplierProductsListItem";
import { SortableTable } from "/imports/plugins/core/ui/client/components";
import { Products } from "/lib/collections";
import Modal from 'react-modal';

class SupplierProductsListReact extends Component {
    constructor(props) {
        super(props);

        this.state = {
          modalIsOpen: false,
          productId: "xxxx",
          openQuantity: 2,
          productName: "qqqq",
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    openModal(product, openQuantity) {
      this.setState({
        modalIsOpen: true,
        productId: product._id,
        productName: product.title,
        openQuantity: openQuantity,
      });
    }

    closeModal(productId, supplyQuantity) {

      if (supplyQuantity || supplyQuantity === 0 ) {
        this.setState({modalIsOpen: false});
        console.log("Suljettu ilman palvelinkutsua");
      } else {
        this.setState({modalIsOpen: false});
        console.log("Suljettu palvelinkutsulla");
        //Kutsu serveriä tässä
      }

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
                        showContractModal={this.openModal}
                    />
                )
            }
        ];

        return (
            <div>
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.state.closeModal}
                contentLabel="Create supllyContract"
                >
                <h2>{this.state.productName}</h2>
                <h3>Avoin määrä: {this.state.openQuantity} </h3>
                <label>Määrä</label>
                <input type="number" id="quantity" name="quantity"/>
                <button onClick={() => this.closeModal()} >Vahvista</button>
                <button onClick={this.closeModal} >Peruuta</button>
                </Modal>

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
