import { Meteor } from 'meteor/meteor';
import { SupplyContracts } from "@olga/olga-collections";
import { ReactiveAggregate } from './reactiveAggregate';
import { Reaction } from "/server/api";

Meteor.publish("SupplierTotals", function() {
  var match = {};

  if (!Reaction.hasPermission("admin")) {
    match = {'userId': Meteor.userId()};
  }

  ReactiveAggregate(this, SupplyContracts, [
    {"$match": match },
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
    }], { clientCollection: "SupplierTotals" }
  );
});
Meteor.publish("SimpleContractTotals", function() {
  var match = {};

  if (!Reaction.hasPermission("admin")) {
    match = {'userId': Meteor.userId()};
  }

  ReactiveAggregate(this, SupplyContracts, [
    {"$match": match },
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
      simpleTitle: {$first: "$simpleTitle"},
      },
    }], { clientCollection: "SimpleContractTotals" }
  );
});

Meteor.publish("VariantContractTotals", function() {
  var match = {};

  if (!Reaction.hasPermission("admin")) {
    match = {'userId': Meteor.userId()};
  }

  ReactiveAggregate(this, SupplyContracts, [
    {"$match": match },
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
    }], { clientCollection: "VariantContractTotals" }
  );
});