import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from './reactiveAggregate';
import { ContractItems } from "/imports/plugins/custom/olga-core/lib/collections/collections";

Meteor.publish("OpenSimpleTotals", function() {
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
    }], { clientCollection: "OpenSimpleTotals" }
  );
});

Meteor.publish("OpenVariantOptionTotals", function() {
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
    }], { clientCollection: "OpenVariantOptionTotals" }
  );
});