import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Deliveries } from "../../lib/collections";
import UserChecks from "../../lib/userChecks";
import { Reaction } from "/server/api";

// kts. server/publications/collections/orders.js
Meteor.publish("Deliveries", function() {
    let userChecks = new UserChecks();

    if(this.userId === null)  {
        return this.ready();
    }
    const shopId = Reaction.getShopId();
    if(!shopId) {
        return this.ready;
    }
    
    if(userChecks.isInRole("admin")) {
        return Deliveries.find({});
    } else {
        return Deliveries.find({
            userId: this.userId
        });
    }
});