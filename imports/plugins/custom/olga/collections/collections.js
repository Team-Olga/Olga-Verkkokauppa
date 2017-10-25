import { Accounts } from "/lib/collections";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Product } from "../../../../../lib/collections/schemas/products";

export const productExtensionSchema = new SimpleSchema({
  products: {
    type: [Product],
    optional: true
  }
});

Accounts.attachSchema(productExtensionSchema);
