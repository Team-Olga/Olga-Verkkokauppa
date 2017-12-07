import { Meteor } from 'meteor/meteor';
import { SupplyContracts } from "/imports/plugins/custom/olga/lib/collections";
import { ReactiveAggregate } from './reactiveAggregate';


Meteor.publish("SupplierTotals", function() {
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
    }], { clientCollection: "ContractTotals" }
  );
});

Meteor.publish("SimpleContractTotals", function() {
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
    }], { clientCollection: "SimpleContractTotals" }
  );
});

Meteor.publish("VariantContractTotals", function() {
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
    }], { clientCollection: "VariantContractTotals" }
  );
});