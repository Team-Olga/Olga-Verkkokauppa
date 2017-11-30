import { Meteor } from 'meteor/meteor';
import { SupplyContracts } from "/imports/plugins/custom/olga/lib/collections";
import { ReactiveAggregate } from './reactiveAggregate';


Meteor.publish("ContractTotals", function() {
  ReactiveAggregate(this, SupplyContracts, [
    {"$group" : {
      _id: {$concat: ["$productId", "-", "$userId"]},
      userId: {$first: "$userId"},
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
      _id: {$concat: ["$productId"]},
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
        }
      }
    }], { clientCollection: "ProductTotals" }
  );
});