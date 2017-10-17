import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check"; 
import { SupplyContracts, Orders } from "../../collections";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Reaction } from "/server/api";
import _ from "lodash";

function coverOrders(product, quantity, supplyContract) {
    let openOrders = Orders.find({}, { sort: { createdAt: 1 }}).fetch();
    // filters those orders where product matches and at least part of the
    // quantity ordered is not matched by supply contracts
    openOrders = _.filter(
        openOrders,
        function(o) {
            let match = false;            
            _.forEach(o.items, function(item) {
                if(item.variants._id == product._id
                    && item.openQuantity > 0
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
        let supplyQuantity = Math.min(contractQuantity, getOpenQuantity(openOrders[i], product));
        updateOpenQuantity(openOrders[i], product, supplyQuantity, supplyContract);
        coveredOrders.push(openOrders[i]._id);
        contractQuantity -= supplyQuantity;
        i++;
    }

    // updates supplyContract with covered orders
    SupplyContracts.update(
        { _id: supplyContract._id },
        { $set: {
            orders: coveredOrders    
        }});
}

function getOpenQuantity(order, product) {
    _.forEach(order.items, function(item) {
        if(item.variants._id == product._id) {
            return item.openQuantity;
        }
    });
    return 0;
}

function updateOpenQuantity(order, product, supplyQuantity, supplyContract) {
    let newItems = order.items;
    _.forEach(newItems, function(item) {
        if(item.variants._id == product._id) {
            item.openQuantity -= supplyQuantity;
            item.supplyContracts.push(supplyContract);
            return false;
        }
    });
    Orders.update(
        { _id: order._id },
        { $set: {
            items: newItems
        }});
}

export const methods = {

    "supplyContracts/create": function (userId, productId, quantity) {
        console.log("within supplyContracts/create");
        check(userId, String);
        check(productId, String);
        check(quantity, Number);

        console.log("SupplyContracts collection: " + SupplyContracts);

        var resultId = SupplyContracts.insert({
            userId: userId,
            productId: productId,
            quantity: quantity
        });

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