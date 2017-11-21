import { Meteor } from 'meteor/meteor';
import { SupplyContracts } from "/imports/plugins/custom/olga/lib/collections";
import { ReactiveAggregate } from './reactiveAggregate';

Meteor.publish("ContractTotals", function() {
  ReactiveAggregate(this, SupplyContracts, [
    {"$group" : {
      _id: {$concat: ["$productId", "-", "$userId"]},
      userId: {$min: "$userId"},
      productId: {$min: "$productId"},
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

Meteor.publish("ProductTotals", function() {
  ReactiveAggregate(this, SupplyContracts, [
    {"$group" : {
      _id: {productId: "$productId"},
      userId: {$addToSet: "$userId"},
      productId: {$min: "$productId"},
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
    }], { clientCollection: "ProductTotals" }
  );
});