import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { Accounts, Products } from "/lib/collections";
import { registerSchema } from "@reactioncommerce/reaction-collections";
import *  as Schemas from "./schemas";
import { Product } from "/lib/collections/schemas/products";


/**
 * Extending Accounts with a product-list
 * @ignore
 */
Accounts.attachSchema(Schemas.productlistSchema);

/**
 * Product settings schema for setting product production time
 * @ignore
 */
export const ProductSettings = new Mongo.Collection("ProductSettings");

ProductSettings.attachSchema(Schemas.ProductSettingsSchema);

/**
 * Supply contracts schema
 * @ignore
 */
export const SupplyContracts = new Mongo.Collection("SupplyContracts");

SupplyContracts.attachSchema(Schemas.SupplyContractSchema);


/**
 * ContractItems Collection
 * @ignore
 */
export const ContractItems = new Mongo.Collection("ContractItems");

ContractItems.attachSchema(Schemas.ContractItemSchema);

/**
 * Delivery Collection
 * @ignore
 */
export const Deliveries = new Mongo.Collection("Deliveries");

Deliveries.attachSchema(Schemas.DeliverySchema);


/**
 * Contract Aggregates per user, simple product and variant-option
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
export const SimpleOpenTotals = new Mongo.Collection("SimpleOpenTotals");

export const VariantOpenTotals = new Mongo.Collection("VariantOpenTotals");


/**
 * Delivery Aggregates per product and user-product
 * @ignore
 */
export const DeliveryProductTotals = new Mongo.Collection("DeliveryProductTotals", {
  transform: (totals) => {
    totals.product = Products.findOne({'_id': totals.productId});    
    return totals;
  }
});

export const DeliveryProductUserTotals = new Mongo.Collection("DeliveryProductUserTotals", {
  transform: (totals) => {
    totals.product = Products.findOne({'_id': totals.productId});
    totals.user = Accounts.findOne({'_id': totals.userId});
    return totals;
  }
});
