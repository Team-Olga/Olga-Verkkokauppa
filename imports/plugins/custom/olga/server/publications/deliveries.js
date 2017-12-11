import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Deliveries } from "../../lib/collections";
import UserChecks from "../helpers/userChecks";
import { Reaction } from "/server/api";
import { ReactiveAggregate } from "../../../olga-core/server/publications/reactiveAggregate";

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

Meteor.publish("DeliveryProductTotals", function() {
  ReactiveAggregate(this, Deliveries, 
    [
      {
        "$group": {
          _id: { $concat: ["$productId"] },
          deliveries: { $addToSet: "$deliveryId" },
          users: { $addToSet: "$userId" },
          productId: { $min: "$productId" },
          deliveredQuantity: { $sum: "$deliveryQuantity" },
          receivedQuantity: { $sum: "$receivedQuantity" }
        }
      }
    ],
    { clientCollection: "DeliveryProductTotals" }
  );
});

Meteor.publish("DeliveryProductUserTotals", function(productId) {
  ReactiveAggregate(this, Deliveries,
    [
      {
        "$group": {
          _id: { $concat: ["$productId", "-", "$userId"] },
          userId: { $first: "$userId" },
          productId: { $min: "$productId" },
          deliveredQuantity: { $sum: "$deliveryQuantity" },
          receivedQuantity: { $sum: "$receivedQuantity" }
        }
      }
    ],
    { clientCollection: "DeliveryProductUserTotals" }
  );
});