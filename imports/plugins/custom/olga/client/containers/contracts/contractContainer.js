import React, { Component } from "react";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import _ from "lodash";
import UserChecks from "../../../lib/userChecks";
import { SupplyContracts } from "../../../lib/collections";
import { Products, Accounts } from "lib/collections";
import { Loading } from "/imports/plugins/core/ui/client/components";
import ContractList from "../../components/contracts/contractList";

const userChecks = new UserChecks();

class ContractContainer extends Component {
    static propTypes = {
      contracts: PropTypes.array
    }

    constructor(props) {
      super(props);
    }

    render() {
      if (_.isEmpty(this.props.contracts)) {
        return  (
          <div>
            <p>Toimitussopimuksia ei löytynyt!</p>
          </div>
        );
      }

      let userStatus;
      if (userChecks.isInRole("admin")) {
        userStatus = "admin";
      } else if (userChecks.isInRole("supplierproductsreact")) {
        userStatus = "supplier";
      }

      return (
        <div>
          <h1 className="olga-list-header">Toimitussopimukset</h1>
          <ContractList
            contracts={this.props.contracts}
            userStatus={userStatus}
          />
        </div>
      );
    }
}

const loadData = (props, onData) => {
  const contractSubscription = Meteor.subscribe("SupplyContracts");
  const productSubscription = Meteor.subscribe("Products");
  const accountSubscription = Meteor.subscribe("Accounts", Meteor.userId());

  if (contractSubscription.ready() && productSubscription.ready()) {
    const baseContracts = SupplyContracts.find({}, { sort: { createdAt: 1 } }).fetch();
    const products = Products.find({}).fetch();
    const accounts = Accounts.find({}).fetch();
    const contracts = enrichContracts(baseContracts, products, accounts);

    onData(null, {
      contracts: contracts
    });
  }
};

function enrichContracts(contracts, products, accounts) {
  _.forEach(contracts, function (contract) {
    const productMatch = _.find(products, function (product) {
      return product._id == contract.productId;
    });
    if (productMatch) {
      contract.productName = productMatch.title;
    }
    const accountMatch = _.find(accounts, function (account) {
      return account._id == contract.userId;
    });
    if (accountMatch) {
      contract.supplierName = accountMatch.name;
    }
  });

  return contracts;
}

export default composeWithTracker(loadData, Loading)(ContractContainer);
