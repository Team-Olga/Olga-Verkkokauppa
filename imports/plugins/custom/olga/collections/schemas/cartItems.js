import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const CartItem = new SimpleSchema({
    supplyContracts: {
        type: [String]
    },
    contractedQuantity: {
        type: Number,
        min: 0,
        defaultValue: 0
    },
    deliveredQuantity: {
        type: Number,
        min: 0,
        defaultValue: 0
    }
});