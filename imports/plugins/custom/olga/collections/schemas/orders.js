import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Order = new SimpleSchema({
    productSupplies: {
        type: [Object],
        optional: true 
    },
    "productSupplies.$.productId": {
        type: String
    },
    "productSupplies.$.supplyContracts": {
        type: [String]
    },
    "productSupplies.$.openQuantity": {
        type: Number,
        min: 0,
        defaultValue: 0
    }
});