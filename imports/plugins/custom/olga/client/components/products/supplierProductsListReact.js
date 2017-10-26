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
          modalIsOpen: true
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    openModal() {
      this.setState({modalIsOpen: true});
    }

    closeModal(productId, supplyQuantity) {

      if (supplyQuantity || supplyQuantity === 0 ) {
      this.setState({modalIsOpen: false});
      } else {
      this.setState({modalIsOpen: false});
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
                <h2>Modal</h2>
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
