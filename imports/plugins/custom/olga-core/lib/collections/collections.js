import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { Accounts, Products } from "/lib/collections";
import { registerSchema } from "@reactioncommerce/reaction-collections";
import *  as Schemas from "./schemas";


/**
 * Extending Accounts and Meteor.users with supplier-products
 * @ignore
 */
Accounts.attachSchema(Schemas.productlistSchema)

//Meteor.users.schema = Accounts;


/**
 * Contract Aggregates per product and user
 * @ignore
 */
export const ContractTotals = new Mongo.Collection("ContractTotals", {
  transform: (totals) => {
    totals.product = Products.findOne({'_id': totals.productId});
    totals.user = Accounts.findOne({'_id': totals.userId});

    return totals;
  }
});

export const ProductTotals = new Mongo.Collection("ProductTotals", {
  transform: (totals) => {
    totals.product = Products.findOne({_id: totals.productId});

    return totals;
  }
});