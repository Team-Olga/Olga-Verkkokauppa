import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const SupplyContract = new SimpleSchema({
  userId: {
      type: String,
      unique: false
  },
  orders: {
      type: [String]
  },
  productId: {
      type: String,
      unique: false
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
  quantity: {
      type: Number,
      defaultValue: 0
  },
  sentQuantity: {
      type: Number,
      defaultValue: 0
  },
  receivedQuantity: {
      type: Number,
      defaultValue: 0
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  }
})