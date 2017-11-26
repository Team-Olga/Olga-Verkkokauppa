import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import SupplierProductsListItem from "./supplierProductsListItem";
import SupplierProductsListBtns from "./supplierProductsListBtns";
import Modal from "react-modal";
import AlertContainer from "react-alert";


class SupplierProductsListReact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contractModalIsOpen: false,
      deliveryModalIsOpen: false,
      productId: "id",
      openQuantity: 0,
      contractedQuantity: 0,
      productName: "name",
      supplyQuantity: 0,
      deliveryQuantity: 0
    };
    this.openContractModal = this.openContractModal.bind(this);
    this.closeContractModal = this.closeContractModal.bind(this);
    this.openDeliveryModal = this.openDeliveryModal.bind(this);
    this.closeDeliveryModal = this.closeDeliveryModal.bind(this);
    this.updateSupplyQuantity = this.updateSupplyQuantity.bind(this);
    this.updateDeliveryQuantity = this.updateDeliveryQuantity.bind(this);
  }

    alertOptions = {
      offset: 14,
      position: "top left",
      theme: "light",
      time: 5000,
      transition: "scale"
    }

    showAlert = (message, type) => {
      this.msg.show(message, {
        time: 5000,
        type: type
      });
    }

    openContractModal(productId, productTitle, openQuantity) {
      this.setState({
        contractModalIsOpen: true,
        deliveryModalIsOpen: false,
        productId: productId,
        productName: productTitle,
        openQuantity: openQuantity,
        contractedQuantity: 0,
        supplyQuantity: 0,
        deliveryQuantity: 0
      });
    }

    openDeliveryModal(productId, productTitle, contractedQuantity) {
      this.setState({
        contractModalIsOpen: false,
        deliveryModalIsOpen: true,
        productId: productId,
        productName: productTitle,
        openQuantity: 0,
        contractedQuantity: contractedQuantity,
        supplyQuantity: 0,
        deliveryQuantity: 0
      });
    }

    closeContractModal() {
      if (this.state.supplyQuantity == 0 || this.state.openQuantity <= 0) {
        this.setState({ contractModalIsOpen: false });
      } else {
        this.setState({ contractModalIsOpen: false });
        const contractId = Meteor.call("supplyContracts/create", this.state.productId, parseInt(this.state.supplyQuantity));
        this.showAlert("Toimitussopimus tehty (" + this.state.productName + " " + this.state.supplyQuantity + " kpl)", "success");
      }
    }

    closeDeliveryModal() {
      if(this.state.deliveryQuantity == 0 || this.state.contractedQuantity <= 0) {
        this.setState({ deliveryModalIsOpen: false });
        console.log("Ei toimitusilmoitusta");
      } else {
        this.setState({ deliveryModalIsOpen: false });
        const deliveryId = Meteor.call("deliveries/create", this.state.productId, parseInt(this.state.deliveryQuantity));
        console.log("Toimitetaan " + this.state.productName + ", " + this.state.deliveryQuantity + " kpl");
        this.showAlert("Toimitusilmoitus tehty (" + this.state.productName + " " + this.state.deliveryQuantity + " kpl", "success");
      }
    }

    updateSupplyQuantity(e) {
      if (Number.isNaN(e.target.value) || !Number.isInteger(Number(e.target.value))) {
        this.showAlert("Toimitusmäärän on oltava kokonaisluku", "error");
      } else if (Number(e.target.value) > this.state.openQuantity) {
        this.showAlert("Voit toimittaa enintään avoinna olevan määrän", "error");
      } else {
        this.setState({ supplyQuantity: e.target.value });
      }
    }

    updateDeliveryQuantity(e) {
      if (Number.isNaN(e.target.value) || !Number.isInteger(Number(e.target.value))) {
        this.showAlert("Toimitusmäärän on oltava kokonaisluku", "error");
      } else if (Number(e.target.value) > this.state.contractedQuantity) {
        this.showAlert("Voit toimittaa enintään sovitun määrän", "error");
      } else {
        this.setState({ deliveryQuantity: e.target.value });
      }
    }

    render() {
      const supplierColumns = [
        {
          Header: "Järjestä nimen mukaan",
          accessor: "title",

          filterMethod: (filter, row) =>
            row[filter.id].toLowerCase().includes(filter.value.toLowerCase()),

          Cell: cellInfo => (
            <SupplierProductsListItem
              productStat={cellInfo.original}
              userStatus={this.props.userStatus}
              showContractModal={this.openContractModal}
              showDeliveryModal={this.openDeliveryModal}
            />
          )
        },
        {
          Header: "Järjestä avoimien tilausten määrän mukaan",
          accessor: "openQuantity",
          defaultSortDesc: true,
          filterable: false,

          Cell: cellInfo => (
            <SupplierProductsListBtns
              productStat={cellInfo.original}
              userStatus={this.props.userStatus}
              showContractModal={this.openContractModal}
              showDeliveryModal={this.openDeliveryModal}
            />
          )
        }
      ];

      return (
        <div>
              <Modal
                isOpen={this.state.contractModalIsOpen}
                onRequestClose={this.state.closeContractModal}
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
                    <button id="cancelContractModal" className="rui btn btn-primary flat olga-listing-btn-default pull-right"
                        onClick={() => this.closeContractModal()} >Peruuta</button>
                    <button id="confirmContract" className="rui btn btn-primary flat olga-listing-btn-success pull-right"
                        onClick={() => this.closeContractModal($('#quantity').val())} >Vahvista</button>
                </div>
              </Modal>

              <Modal
                isOpen={this.state.deliveryModalIsOpen}
                onRequestClose={this.state.closeDeliveryModal}
                contentLabel="Create delivery"
                className={{
                    base: "deliveryModal",
                    afterOpen: "deliveryModal_after-open",
                    beforeClose: "deliveryModal_before-close"
                }}
                overlayClassName={{
                    base: "deliveryModalOverlay",
                    afterOpen: "deliveryModalOverlay_after-open",
                    beforeClose: "deliveryModalOverlay_before-close"
                }}
                >
                <h2 id="contractModalTitle">{this.state.productName}</h2>
                <h3>Sovittu toimitusmäärä: <span id="contractedQuantity">{this.state.contractedQuantity}</span> </h3>
                <h3><label htmlFor="deliveryQuantity">Toimitettava määrä: </label>
                <input type="number" id="deliveryQuantity" name="deliveryQuantity" className="right-justified" min="0" max={this.state.contractedQuantity}
                    onChange={this.updateDeliveryQuantity} value={this.state.deliveryQuantity}/></h3>
                <div>
                    <button id="cancelDeliveryModal" className="rui btn btn-primary flat olga-listing-btn-default pull-right"
                        onClick={() => this.closeDeliveryModal()} >Peruuta</button>
                    <button id="confirmDelivery" className="rui btn btn-primary flat olga-listing-btn-success pull-right"
                        onClick={() => this.closeDeliveryModal($('#quantity').val())} >Vahvista</button>
                </div>
              </Modal>

              <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

              <ReactTable
                data={this.props.productStats}
                noDataText="Avoimia tilauksia ei löytynyt"
                columns={supplierColumns}
                defaultPageSize={10}
                minRows={0}
                className="olga-list-table"
                filterable
                defaultFilterMethod={(filter, row) =>
                  String(row[filter.id]) === filter.value}
              />
        </div>
      );
    }
}

SupplierProductsListReact.propTypes = {
  productStats: PropTypes.arrayOf(PropTypes.object),
  userStatus: PropTypes.string
};

export default SupplierProductsListReact;
