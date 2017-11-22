import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check"; 
import { Deliveries, SupplyContracts } from "../../lib/collections";
import { Orders } from "/lib/collections";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Reaction } from "/server/api";
import { Roles } from "meteor/alanning:roles";
import UserChecks from "../../lib/userChecks";
import _ from "lodash";

function initializeDelivery(userId, productId, quantity) {
    if(getOpenContracts(productId).length == 0) {
        return null;
    }
    var deliveryId = Deliveries.insert({
        userId: userId,
        productId: productId,
        deliveryQuantity: quantity,
        supplyContracts: [],        
    });
    return deliveryId;
}

function coverContracts(productId, quantity, deliveryId) {
    let openContracts = getOpenContracts(productId);
    let coveredContracts = [];
    let deliveryQuantity = quantity;
    let i = 0;
    while(deliveryQuantity > 0 && i < openContracts.length) {
        let openQuantity = openContracts[i].quantity - openContracts[i].sentQuantity;
        let allocatedQuantity = Math.min(openQuantity, deliveryQuantity);
        if(allocatedQuantity > 0) {
            updateSentQuantity(openContracts[i], openContracts[i].sentQuantity + allocatedQuantity);
            coveredContracts.push(openContracts[i]._id);
            deliveryQuantity -= allocatedQuantity;
        }
        i++;
    }

    return coveredContracts;
}

function updateSentQuantity(supplyContract, sentQuantity) {
    SupplyContracts.update(
        { _id: supplyContract._id },
        {
            $set: { sentQuantity: sentQuantity }
        }
    );
}

function enrichDelivery(deliveryId, coveredContracts) {
    Deliveries.update(
        { _id: deliveryId },
        {
            $set: { supplyContracts: coverContracts }
        }
    )
}

function getOpenContracts(productId) {
    return SupplyContracts.find(
        { 
            productId: productId,
            $where: function() {
                return (this.sentQuantity < this.quantity);
            }
        },
        {
            sort: { createdAt: 1 }
        }
    ).fetch();
}

export const methods = {

    "deliveries/create": function (productId, quantity) {
        check(productId, String);
        check(quantity, Number);

        let userId = Meteor.userId();
        let userChecks = new UserChecks();

        if(!Reaction.hasAdminAccess() && !userChecks.isInRole("supplier")) {
            throw new Meteor.Error(403, "Access Denied");
        }

        let deliveryId = initializeDelivery(userId, productId, quantity);
        if(!deliveryId) {
            return null;
        }
        let coveredContracts = coverContracts(productId, quantity, deliveryId);
        enrichDelivery(deliveryId, coveredContracts);

        return deliveryId;
    }

}

Meteor.methods(methods);