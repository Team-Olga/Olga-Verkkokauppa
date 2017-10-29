import { Orders } from "/lib/collections/collections";
import _ from "lodash";

Orders.before.insert(function(userId, order) {
    let productSupplies = [];
    if(order.items) {
        _.forEach(order.items, function(item) {
            let productSupply= {};
            productSupply.productId = item.variants._id;
            productSupply.supplyContracts = [];
            productSupply.openQuantity = item.quantity;
            productSupplies.push(productSupply);
        });
    }
    order.productSupplies = productSupplies;
});