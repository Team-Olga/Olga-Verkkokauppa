import { Meteor } from 'meteor/meteor';
import { SupplyContracts } from "/imports/plugins/custom/olga/lib/collections";
import { ReactiveAggregate } from './reactiveAggregate';

Meteor.publish("ContractTotals", function() {
// Remember, ReactiveAggregate doesn't return anything
    ReactiveAggregate(this, SupplyContracts, [
      {"$match": {userId: Meteor.userId()}},
      {"$group" : {
        _id: {$concat: ["$productId", "-", "$userId"]},
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
      }], { clientCollection: "ContractTotals" });
});