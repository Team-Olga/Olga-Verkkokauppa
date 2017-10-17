import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const CartItem = new SimpleSchema({
    supplyContracts: {
        type: [String]
    },
    openQuantity: {
        type: Number,
        min: 0,
        defaultValue: 0
    }
});