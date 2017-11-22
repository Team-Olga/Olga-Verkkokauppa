import React, { Component } from "react";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import _ from "lodash";
import UserChecks from "../../../lib/userChecks";
import { Products, Orders, Accounts } from "lib/collections";
import { SupplyContracts } from "../../../lib/collections";
import { Loading } from "/imports/plugins/core/ui/client/components";
import SupplierProductsListReact from "../../components/products/supplierProductsListReact";

let userChecks = new UserChecks();

class SupplierProductsContainer extends Component {
    static propTypes = {
      productStats: PropTypes.array
    }

    constructor(props) {
      super(props);
    }

    render() {
      if (_.isEmpty(this.props.productStats)) {
        return (
          <div>
            <p>Tuotteita ei löytynyt!</p>
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
          <h1 className="olga-list-header">Tuotteet</h1>
          <SupplierProductsListReact
            productStats={this.props.productStats}
            userStatus={userStatus}
          />
        </div>
      );
    }
}

const loadData = (props, onData) => {
  const productsSubscription = Meteor.subscribe("Products");
  const contractSubscription = Meteor.subscribe("SupplyContracts");
  const ordersSubscription = Meteor.subscribe("SupplierOrders");
  const accountsSubscription = Meteor.subscribe("Accounts", Meteor.userId());

  if (productsSubscription.ready() 
      && contractSubscription.ready() 
      && ordersSubscription.ready()
      && accountsSubscription.ready()) {
    const allProducts = Products.find(
      { type: "variant", isDeleted: false, isVisible: true }, 
      { sort: { createdAt: 1 } }
    ).fetch();
    const allOrders = Orders.find({}, { sort: { createdAt: 1 } }).fetch();
    const allContracts = SupplyContracts.find({}, { sort: { createdAt: 1 } }).fetch();
    const allAccounts = Accounts.find({}).fetch();

    const productStats = getProductStats(allOrders, allContracts, allProducts, allAccounts);

    onData(null, {
      productStats: productStats
    });
  }
};

/**
 * Create an array of product stat objects that can be used directly as an input
 * for listing products and their related stats to admins/suppliers.
 * NB! Filters out some Products alltogether:
 * - all Products where type <> "variant" as only variants can be ordered by customers
 * - for suppliers, those Products where open quantity == 0 and contracted quantity == 0
 * - for suppliers, only Products attached to the supplier will be included
 * @param {Array} orders Array of Order objects
 * @param {Array} contracts Array of SupplyContract objects
 * @param {Array} products Array of Product objects
 * @param {Array} accounts Array of Account objects
 * @returns {Array} Array of objects that can be used directly to list product stats. 
 */
function getProductStats(orders, contracts, products, accounts) {
  const productStats = [];

  _.forEach(products, function (product) {
    let isAttachedProduct = false;
    if(userChecks.isInRole("admin")) {
      isAttachedProduct = true;
    } else {
      let productMatch = _.find(accounts[0].products, function(attachedProduct) {
        return _.indexOf(product.ancestors, attachedProduct._id) > -1;
      });
      if(productMatch) {
        isAttachedProduct = true;
      }
    }

    if(isAttachedProduct) {
      const productStat = calculateProductFigures(orders, contracts, product._id);
      if(userChecks.isInRole("admin") || (productStat.openQuantity > 0 || productStat.contractedQuantity > 0)) {
        productStat.title = product.title;
        productStat.detailsHref = "#";
        productStat.productId = product._id;
        productStats.push(productStat);
      }
    }
  });

  return productStats;
}

function calculateProductFigures(orders, contracts, productId) {
  const productFigures = {};
  let orderCount = 0;
  let orderQuantity = 0;
  let openQuantity = 0;
  let contractedQuantity = 0;
  let sentQuantity = 0;
  let receivedQuantity = 0;

  _.forEach(orders, function (o) {
    _.forEach(o.items, function (item) {
      if (item.variants._id == productId) {
        orderCount++;
        orderQuantity += item.quantity;
      }
    });
    _.forEach(o.productSupplies, function (productSupply) {
      if (productSupply.productId == productId) {
        openQuantity += productSupply.openQuantity;
      }
    });
  });

  _.forEach(contracts, function (contract) {
    if (contract.productId == productId) {
      contractedQuantity += contract.quantity;
      sentQuantity += contract.sentQuantity;
      receivedQuantity += contract.receivedQuantity;
    }
  });

  productFigures.orderCount = orderCount;
  productFigures.orderQuantity = orderQuantity;
  productFigures.openQuantity = openQuantity;
  productFigures.contractedQuantity = contractedQuantity - sentQuantity;
  productFigures.sentQuantity = sentQuantity - receivedQuantity;

  return productFigures;
}

export default composeWithTracker(loadData, Loading)(SupplierProductsContainer);
