import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { SupplyContracts } from "../../lib/collections";
import { Reaction } from "/server/api";

// kts. server/publications/collections/orders.js
Meteor.publish("SupplyContracts", function() {
    if(this.userId === null)  {
        return this.ready();
    }
    const shopId = Reaction.getShopId();
    if(!shopId) {
        return this.ready;
    }
    if(Roles.userIsInRole(this.userId, ["admin", "owner"], shopId)){
        return SupplyContracts.find({
            shopId: shopId
        });
    }
    return SupplyContracts.find({
        shopId: shopId,
        userId: this.userId
    });
});