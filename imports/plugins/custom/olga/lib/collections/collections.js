import { Accounts, Orders } from "/lib/collections";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";
import *  as Schemas from "./schemas";
import { Product } from "../../../../../../lib/collections/schemas/products";
import { Mongo } from "meteor/mongo";

export const productExtensionSchema = new SimpleSchema({
  products: {
    type: [Product],
    optional: true
  }
});

export const SupplyContracts = new Mongo.Collection("SupplyContracts");
SupplyContracts.attachSchema(Schemas.SupplyContract);
registerSchema("SupplyContract", Schemas.SupplyContract);

export const Deliveries = new Mongo.Collection("Deliveries");
Deliveries.attachSchema(Schemas.Delivery);
registerSchema("Delivery", Schemas.Delivery);

Accounts.attachSchema(productExtensionSchema);
Orders.attachSchema(Schemas.Order);