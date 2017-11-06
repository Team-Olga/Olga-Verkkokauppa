import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
 * Information on supply contract situation per each product in the Order
 * is placed in an array that is a direct property of an Order (as extending
 * the schema for a CartItem didn't succeed).
 */
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