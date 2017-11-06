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