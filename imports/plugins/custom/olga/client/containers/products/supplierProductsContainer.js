import React, { Component } from "react";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import _ from "lodash";
import { isInRole, getAllRoles } from "../../../lib/userChecks";
import { Products, Orders } from "lib/collections";
import { SupplyContracts } from "../../../lib/collections";
import { Loading } from "/imports/plugins/core/ui/client/components";
import SupplierProductsListReact from "../../components/products/supplierProductsListReact";

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
      if (isInRole("admin")) {
        userStatus = "admin";
      } else if (isInRole("supplierproductsreact")) {
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

  if (productsSubscription.ready() && contractSubscription.ready() && ordersSubscription.ready()) {
    const allProducts = Products.find({ type: "variant" }, { sort: { createdAt: 1 } }).fetch();
    const allOrders = Orders.find({}, { sort: { createdAt: 1 } }).fetch();
    const allContracts = SupplyContracts.find({}, { sort: { createdAt: 1 } }).fetch();
    const productStats = getProductStats(allOrders, allContracts, allProducts);

    onData(null, {
      productStats: productStats
    });
  }
};

function getProductStats(orders, contracts, products) {
  const productStats = [];

  _.forEach(products, function (product) {
    const productStat = calculateProductFigures(orders, contracts, product._id);
    if(isInRole("admin") || (productStat.openQuantity > 0 || productStat.contractedQuantity > 0)) {
      productStat.title = product.title;
      productStat.detailsHref = "#";
      productStat.productId = product._id;

      productStats.push(productStat);
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
    }
  });

  productFigures.orderCount = orderCount;
  productFigures.orderQuantity = orderQuantity;
  productFigures.openQuantity = openQuantity;
  productFigures.contractedQuantity = contractedQuantity;
  productFigures.sentQuantity = sentQuantity;

  return productFigures;
}

export default composeWithTracker(loadData, Loading)(SupplierProductsContainer);
