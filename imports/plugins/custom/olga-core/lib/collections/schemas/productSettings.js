import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";

export const ProductSettingsSchema = new SimpleSchema({
  _id: {
    type: String
  },
  productId: {
    type: String,
    index: 1,
    unique: true
  },
  productionTime: {
    type: Number,
    optional: true
  }
});

registerSchema("ProductSettingsSchema", ProductSettingsSchema);
