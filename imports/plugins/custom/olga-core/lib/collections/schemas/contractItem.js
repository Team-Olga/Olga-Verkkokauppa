import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Product } from "/lib/collections/schemas";
import { registerSchema } from "@reactioncommerce/reaction-collections";


export const ContractItemSchema = new SimpleSchema({
  _id: {
    type: String
  }, 
  productId: {
    type: String,
    index: 1
  },
  simpleId: {
    type: String,
  },
  variantId: {
    type: String,
  },
  optionId: {
    type: String,
  },
  simpleTitle: {
    type: String,
    label: "ContractItem Title"
  },
  variantTitle: {
    type: String,
    label: "ContractItem Variant Title"
  },
  optionTitle: {
    type: String,
    label: "ContractItem Option Title"
  },
  isOption: {
    type: Boolean,
    label: "ContractItem is an option of a variant"
  },
  orderId: {
    type: String,
    index: 1,
    label: "ContractItem orderId"
  },
  contracts: {
  	type: [String],
  	label: "Array of SupplyContract Ids",
  	defaultValue: []
  },
  quantity: {
    label: "Quantity",
    type: Number,
    min: 0
  },
  openQuantity: {
    label: "Quantity",
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    denyUpdate: true
  }
});

registerSchema("ContractItemSchema", ContractItemSchema);
