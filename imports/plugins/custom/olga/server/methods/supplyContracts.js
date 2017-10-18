import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check"; 
import { SupplyContracts, Orders } from "../../collections";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Reaction } from "/server/api";
import _ from "lodash";

function initializeContract(userId, productId, quantity) {
    var supplyContractId = SupplyContracts.insert({
        userId: userId,
        productId: productId,
        quantity: quantity
    });
    return supplyContractId;
}

function coverOrders(productId, quantity, supplyContractId) {
    let openOrders = Orders.find({}, { sort: { createdAt: 1 }}).fetch();
    // filters those orders where product matches and at least part of the
    // quantity ordered is not matched by other supply contracts
    openOrders = _.filter(
        openOrders,
        function(o) {
            let match = false;            
            _.forEach(o.productSupplies, function(productSupply) {
                if(productSupply.productId == productId
                    && productSupply.openQuantity > 0
                    ) {
                    match = true;
                }
            });
            return match;
        });

    // loops through open orders (assumed to be in ascending chronological order)
    // and "spends" contractQuantity on each of them in turn until contractQuantity == 0
    let coveredOrders = [];
    let contractQuantity = quantity;
    let i = 0;
    while(contractQuantity > 0 && i < coverOrders.length) {
        let supplyQuantity = Math.min(contractQuantity, getOpenQuantity(openOrders[i], productId));
        updateOpenQuantity(openOrders[i], productId, supplyQuantity, supplyContractId);
        coveredOrders.push(openOrders[i]._id);
        contractQuantity -= supplyQuantity;
        i++;
    }
}

function enrichContract(supplyContractId, coveredOrders) {
    SupplyContracts.update(
        { _id: supplyContract._id },
        { $set: {
            orders: coveredOrders    
        }});
}

function getOpenQuantity(order, productId) {
    _.forEach(order.productSupplies, function(productSupply) {
        if(productSupply.productId == productId) {
            return productSupply.openQuantity;
        }
    });
    return 0;
}

function updateOpenQuantity(order, productId, supplyQuantity, supplyContractId) {
    let newSupplies = order.productSupplies;
    _.forEach(newSupplies, function(productSupply) {
        if(productSupply.productId == productId) {
            productSupply.openQuantity -= supplyQuantity;
            productSupply.supplyContracts.push(supplyContractId);
            return false;
        }
    });
    Orders.update(
        { _id: order._id },
        { $set: {
            productSupplies: newSupplies
        }});
}

export const methods = {

    "supplyContracts/create": function (userId, productId, quantity) {
        console.log("within supplyContracts/create");
        check(userId, String);
        check(productId, String);
        check(quantity, Number);

        let supplyContractId = initializeContract(userId, productId, quantity);
        let coveredOrders = coverOrders(productId, quantity, supplyContractId);
        enrichContract(supplyContractId, coveredOrders);

        return resultId;
    },

    "supplyContracts/delete": function (supplyContractId) {
        check(supplyContractId, String);

        if(!Reaction.hasAdminAccess()) {
            throw new Meteor.Error(403, "Access Denied");
        }

        SupplyContracts.remove(supplyContractId);
    }

};

Meteor.methods(methods);