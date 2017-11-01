import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import SupplierProductsListItem from "./supplierProductsListItem";
import { SortableTable } from "/imports/plugins/core/ui/client/components";
import { Products } from "/lib/collections";
import Modal from 'react-modal';
import AlertContainer from 'react-alert';


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

    alertOptions = {
        offset: 14,
        position: 'top left',
        theme: 'light',
        time: 5000,
        transition: 'scale'
    }

    showAlert = (message) => {
        this.msg.show(message, {
            time: 2000,
            type: 'success'
        })
    }

    openModal(product, openQuantity) {
      this.setState({
        modalIsOpen: true,
        productId: product._id,
        productName: product.title,
        openQuantity: openQuantity,
      });
    }

    closeModal(supplyQuantity) {

      if (!supplyQuantity || supplyQuantity == 0 ) {
        this.setState({modalIsOpen: false});
        console.log("Suljettu ilman palvelinkutsua");
      } else {
        this.setState({modalIsOpen: false});
        console.log("Suljettu palvelinkutsulla, määrä " + supplyQuantity);
        //Kutsu serveriä tässä
        this.showAlert('Toimitussopimus tehty ('+this.state.productName+' '+supplyQuantity+' kpl)');
      }

    }

    render() {
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
                contentLabel="Create supplyContract"
                className={{
                    base: "contractModal",
                    afterOpen: "contractModal_after-open",
                    beforeClose: "contractModal_before-close"
                }}
                overlayClassName={{
                    base: "contractModalOverlay",
                    afterOpen: "contractModalOverlay_after-open",
                    beforeClose: "contractModalOverlay_before-close"
                }}
                >
                <h2>{this.state.productName}</h2>
                <h3>Avoin määrä: {this.state.openQuantity} </h3>
                <h3><label htmlFor="quantity">Toimitettava määrä: </label>
                <input type="number" id="quantity" name="quantity" className="right-justified" min="0" max={this.state.openQuantity}/></h3>
                <div>
                    <button className="rui btn btn-primary flat olga-listing-btn-default pull-right" onClick={() => this.closeModal()} >Peruuta</button>
                    <button className="rui btn btn-primary flat olga-listing-btn-success pull-right" onClick={() => this.closeModal($('#quantity').val())} >Vahvista</button>                    
                </div>
                </Modal>

                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

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
