import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const SupplyContract = new SimpleSchema({
    userId: {
        type: String,
        unique: false
    },
    orderId: {
        type: String,
        unique: false
    },
    productId: {
        type: String,
        unique: false
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
    }
})