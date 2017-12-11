import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check"; 

import { Reaction } from "/server/api";
import { ContractItems } from '/imports/plugins/custom/olga-core/lib/collections/collections';
import { SupplyContracts } from "/imports/plugins/custom/olga/lib/collections";


Meteor.methods({
  "supplyContracts/create": function (productId, quantity) {
    check(productId, String);
    check(quantity, Match.Where((x) => {
      check(x, Number);
      return x > 0;
    }));

    let userId = Meteor.userId();

    if(!Reaction.hasAdminAccess() && !Reaction.hasPermission('supplier')) {
        throw new Meteor.Error(403, "Access Denied");
    }

    // Fetch Contract Items with open quantities for given productId
    let contractItems = ContractItems.find(
      { productId: productId, openQuantity: {$gt: 0} }
    ).fetch();

    // Check total open quantity
    let totalOpen = _.sumBy(contractItems, item => item.openQuantity);

    if (quantity > totalOpen) {
        throw new Meteor.Error(400, "Invalid contract quantity");
    }

    // Create contract
    var contractId = SupplyContracts.insert(
      _.merge({
        userId: userId,
        productId: productId,
        quantity: quantity,
        orders: [],
        sentQuantity: 0,
        receivedQuantity: 0
      },
      _.pick(contractItems[0], [
        'simpleId', 'variantId', 'optionId',
        'simpleTitle', 'variantTitle', 'optionTitle',
        'isOption'
      ])
    ));

    // Update ContractItem quantities and contracts
    let cqnt = quantity;
    let contracted = []

    for (let item of contractItems) {
      let newQuantity = item.openQuantity - cqnt;
      contracted.push(item.orderId)

      ContractItems.update(
        { _id: item._id },
        { $set: { openQuantity: Math.max(newQuantity, 0)} },
        { $push: { contracts: contractId} }
      );

      if (newQuantity >= 0) break;

      cqnt -= item.openQuantity;
    }

    // Update SupplyContract orders
    SupplyContracts.update(
      { _id: contractId },
      { $pushAll: { orders: contracted} }
    ); 

    return contractId;
  },
  
  // TODO: Update ContractItems when deleting
  "supplyContracts/delete": function (contractId) {
    check(contractId, String);

    if(!Reaction.hasAdminAccess()) {
        throw new Meteor.Error(403, "Access Denied");
    }

    SupplyContracts.remove(contractId);
  }
});

