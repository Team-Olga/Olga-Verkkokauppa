import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Product } from "/lib/collections/schemas";

export const productlistSchema = new SimpleSchema({
  products: {
  	label: "List of Products",
    type: [Product],
    defaultValue: [],
  }
});