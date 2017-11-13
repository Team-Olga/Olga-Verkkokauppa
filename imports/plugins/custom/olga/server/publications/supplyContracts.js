import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { SupplyContracts } from "../../lib/collections";
import { isInRole } from "../../lib/userChecks";
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
    
    if(isInRole("admin")) {
        return SupplyContracts.find({});
    } else {
        return SupplyContracts.find({
            userId: this.userId
        });
    }
});