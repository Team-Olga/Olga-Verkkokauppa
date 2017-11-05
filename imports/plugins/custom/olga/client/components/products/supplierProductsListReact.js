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
          productId: "id",
          openQuantity: 2,
          productName: "name",
          supplyQuantity: 0
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateSupplyQuantity = this.updateSupplyQuantity.bind(this);
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

    openModal(productId, productTitle, openQuantity) {
      this.setState({
        modalIsOpen: true,
        productId: productId,
        productName: productTitle,
        openQuantity: openQuantity,
        supplyQuantity: 0
      });
    }

    closeModal() {
      if (this.state.supplyQuantity == 0 ) {
        this.setState({modalIsOpen: false});
      } else {
        this.setState({modalIsOpen: false});
        Meteor.call("supplyContracts/create", this.state.productId, parseInt(this.state.supplyQuantity));
        this.showAlert('Toimitussopimus tehty (' + this.state.productName + ' ' + this.state.supplyQuantity + ' kpl)');
      }
    }

    updateSupplyQuantity(e) {
        this.setState({ supplyQuantity: e.target.value });
    }

    render() {
        const supplierColumns = [
            {
                Header: "",
                accessor: "title",
                Cell: cellInfo => (
                    <SupplierProductsListItem
                        productStat={cellInfo.original}
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
                <h2 id="contractModalTitle">{this.state.productName}</h2>
                <h3>Avoin määrä: <span id="openQuantity">{this.state.openQuantity}</span> </h3>
                <h3><label htmlFor="quantity">Toimitettava määrä: </label>
                <input type="number" id="quantity" name="quantity" className="right-justified" min="0" max={this.state.openQuantity}
                    onChange={this.updateSupplyQuantity} value={this.state.supplyQuantity}/></h3>
                <div>
                    <button id="cancelModal" className="rui btn btn-primary flat olga-listing-btn-default pull-right" 
                        onClick={() => this.closeModal()} >Peruuta</button>
                    <button id="confirmContract" className="rui btn btn-primary flat olga-listing-btn-success pull-right" 
                        onClick={() => this.closeModal($('#quantity').val())} >Vahvista</button>                    
                </div>
                </Modal>

                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

                <ReactTable
                    data={this.props.productStats}
                    columns={supplierColumns}
                    defaultPageSize={10}
                    className="olga-list-table"
                />
            </div>
        );
    }
}

SupplierProductsListReact.propTypes = {
    productStats: PropTypes.arrayOf(PropTypes.object),
    userStatus: PropTypes.string
}

export default SupplierProductsListReact;
