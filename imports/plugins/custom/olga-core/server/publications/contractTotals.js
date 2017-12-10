import { Meteor } from 'meteor/meteor';
import { SupplyContracts } from "/imports/plugins/custom/olga/lib/collections";
import { ReactiveAggregate } from './reactiveAggregate';
import UserChecks from "../../../olga/server/helpers/userChecks";

Meteor.publish("SupplierTotals", function() {
  let userChecks = new UserChecks();
  let observeSelector = {};
  if(userChecks.isInRole("admin")) {
    observeSelector = {};
  } else {
    observeSelector = { userId: this.userId };
  }

  ReactiveAggregate(this, SupplyContracts, [
    {"$group" : {
      _id: {$concat: ["$userId"]},
      userId: {$first: "$userId"},
      productIds: {$addToSet: "$simpleId"},
      received:{$sum:"$receivedQuantity"},
      delivery:{$sum:"$sentQuantity"},
      production: {
        $sum:{
          $subtract: ["$quantity", 
            {$add: [ "$receivedQuantity", "$sentQuantity" ]}
            ]
          }
        }
      }
    }], 
    { 
      clientCollection: "ContractTotals",
      observeSelector: observeSelector
    }
  );
});

Meteor.publish("SimpleContractTotals", function() {
  let userChecks = new UserChecks();
  let observeSelector = {};
  if(userChecks.isInRole("admin")) {
    observeSelector = {};
  } else {
    observeSelector = { userId: this.userId };
  }

  ReactiveAggregate(this, SupplyContracts, [
    {"$group" : {
      _id: {$concat: ["$simpleId"]},
      users: {$addToSet: "$userId"},
      productId: {$min: "$productId"},
      received:{$sum:"$receivedQuantity"},
      delivery:{$sum:"$sentQuantity"},
      production: {
        $sum:{
          $subtract: ["$quantity", 
            {$add: [ "$receivedQuantity", "$sentQuantity" ]}
            ]
          }
        },
      simpleId: {$first: "$simpleId"},
      variantId: {$first: "$variantId"},
      optionId: {$first: "$optionId"},
      simpleTitle: {$first: "$simpleTitle"},
      variantTitle: {$first: "$variantTitle"},
      optionTitle: {$first: "$optionTitle"},
      isOption: {$first: "$isOption"},
      },
    }], 
    { 
      clientCollection: "SimpleContractTotals",
      observeSelector: observeSelector 
    }
  );
});

Meteor.publish("VariantContractTotals", function() {
  let userChecks = new UserChecks();
  let observeSelector = {};
  if(userChecks.isInRole("admin")) {
    observeSelector = {};
  } else {
    observeSelector = { userId: this.userId };
  }

  ReactiveAggregate(this, SupplyContracts, [
    {"$group" : {
      _id: {$concat: ["$variantId", "-", "$optionId"]},
      users: {$addToSet: "$userId"},
      productId: {$min: "$productId"},
      received:{$sum:"$receivedQuantity"},
      delivery:{$sum:"$sentQuantity"},
      production: {
        $sum:{
          $subtract: ["$quantity", 
            {$add: [ "$receivedQuantity", "$sentQuantity" ]}
            ]
          }
        },
      simpleId: {$first: "$simpleId"},
      variantId: {$first: "$variantId"},
      optionId: {$first: "$optionId"},
      simpleTitle: {$first: "$simpleTitle"},
      variantTitle: {$first: "$variantTitle"},
      optionTitle: {$first: "$optionTitle"},
      isOption: {$first: "$isOption"},
      },
    }], 
    { 
      clientCollection: "VariantContractTotals", 
      observeSelector: observeSelector
    }
  );
});