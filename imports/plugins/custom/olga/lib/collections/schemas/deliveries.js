import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Delivery = new SimpleSchema({
    userId: {
        type: String        
    },
    productId: {
        type: String
    },
    deliveryQuantity: {
        type: Number,
        defaultValue: 0
    },
    supplyContracts: {
        type: [String]
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