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


/**
 * ContractItems Collection
 * @ignore
 */
export const ContractItems = new Mongo.Collection("ContractItems");

ContractItems.attachSchema(Schemas.ContractItemSchema);


/**
 * Contract Aggregates per product and user
 * @ignore
 */
export const ContractTotals = new Mongo.Collection("ContractTotals", {
  transform: (totals) => {
    //totals.product = Products.findOne({'_id': totals.productId});
    totals.user = Accounts.findOne({'_id': totals.userId});
    //totals.info = ContractItems.findOnde({'productId': totals.productId})

    return totals;
  }
});

export const SimpleContractTotals = new Mongo.Collection("SimpleContractTotals");

export const VariantContractTotals = new Mongo.Collection("VariantContractTotals");


/**
 * ContractItem Aggregates per simple product and variant-option
 * @ignore
 */
export const OpenSimpleTotals = new Mongo.Collection("OpenSimpleTotals");

export const OpenVariantOptionTotals = new Mongo.Collection("OpenVariantOptionTotals");