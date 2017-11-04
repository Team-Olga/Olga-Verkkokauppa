import { Accounts, Orders } from "/lib/collections";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import *  as Schemas from "./schemas";
import { Product } from "../../../../../lib/collections/schemas/products";

export const productExtensionSchema = new SimpleSchema({
  products: {
    type: [Product],
    optional: true
  }
});

export const SupplyContracts = new Mongo.Collection("SupplyContracts");
console.log("Attaching olga-schemas");
SupplyContracts.attachSchema(Schemas.SupplyContract);

Accounts.attachSchema(productExtensionSchema);
Orders.attachSchema(Schemas.Order);
