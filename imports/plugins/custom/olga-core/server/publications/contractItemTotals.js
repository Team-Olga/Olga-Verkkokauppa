import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from './reactiveAggregate';
import { ContractItems } from "@olga/olga-collections";

Meteor.publish("SimpleOpenTotals", function() {
  ReactiveAggregate(this, ContractItems, [
    {"$group" : {
      _id: {$concat: ["$simpleId"]},
      productId: {$first: "$productId"},
      simpleId: {$first: "$simpleId"},
      variantId: {$first: "$variantId"},
      optionId: {$first: "$optionId"},
      simpleTitle: {$first: "$simpleTitle"},
      variantTitle: {$first: "$variantTitle"},
      optionTitle: {$first: "$optionTitle"},
      isOption: {$first: "$isOption"},
      openQuantity:{$sum:"$openQuantity"},
      }
    }], { clientCollection: "SimpleOpenTotals" }
  );
});

Meteor.publish("VariantOpenTotals", function() {
  ReactiveAggregate(this, ContractItems, [
    {"$group" : {
      _id: {$concat: ["$variantId", '-', '$optionId']},
      productId: {$first: "$productId"},
      simpleId: {$first: "$simpleId"},
      variantId: {$first: "$variantId"},
      optionId: {$first: "$optionId"},
      simpleTitle: {$first: "$simpleTitle"},
      variantTitle: {$first: "$variantTitle"},
      optionTitle: {$first: "$optionTitle"},
      isOption: {$first: "$isOption"},
      openQuantity:{$sum:"$openQuantity"},
      }
    }], { clientCollection: "VariantOpenTotals" }
  );
});