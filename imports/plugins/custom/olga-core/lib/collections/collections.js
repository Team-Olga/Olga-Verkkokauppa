import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { Accounts, Products } from "/lib/collections";
import { registerSchema } from "@reactioncommerce/reaction-collections";
import *  as Schemas from "./schemas";


/**
 * Extending Accounts with a product-list
 * @ignore
 */
Accounts.attachSchema(Schemas.productlistSchema)

/**
 * Product settings schema for setting product production time
 * @ignore
 */
export const ProductSettings = new Mongo.Collection("ProductSettings");

ProductSettings.attachSchema(Schemas.ProductSettingsSchema);


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
export const SupplierTotals = new Mongo.Collection("SupplierTotals", {
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