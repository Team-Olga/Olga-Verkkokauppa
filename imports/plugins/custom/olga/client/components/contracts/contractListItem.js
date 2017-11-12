import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "/imports/plugins/core/ui/client/components";

class ContractListItem extends Component {

    constructor(props) {
        super(props);

        this.handleCancelContractClick = this.handleCancelContractClick.bind(this);
        this.handleSuppliedCountClick = this.handleSuppliedCountClick.bind(this);
    }

    handleCancelContractClick(e) {
        e.preventDefault();
    }

    handleSuppliedCountClick(e) {
        e.preventDefault();
    }

    render() {
        return (           
            <div className="row supplier-product-row">
                <a href="#"><span className="olga-listing-title">{this.props.contract.productName} </span></a>
                <a href="#"><span className="olga-listing-title">{this.props.contract.supplierName}</span></a>
                <span className="olga-listing-details"> Sovittu: {this.props.contract.quantity} kpl</span>
                <span className="olga-listing-details"> {this.props.contract.createdAt.toLocaleDateString('fi-FI')}</span>
                {this.props.userStatus == "admin" &&
                    <Button status="danger" bezelStyle="flat" className="olga-listing-btn-danger pull-right"
                        onClick={this.handleCancelContractClick}>
                        Peruuta
                    </Button>
                }
                <Button status="primary" bezelStyle="flat" className="olga-listing-btn-primary pull-right"
                    onClick={this.handleSuppliedCountClick}>
                    Toimitettu {this.props.contract.sentQuantity}
                </Button>
            </div>
        );
    }
}

ContractListItem.propTypes = {
    contract: PropTypes.object,
    userStatus: PropTypes.string
};

export default ContractListItem;