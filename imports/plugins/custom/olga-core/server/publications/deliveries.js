import { Meteor } from "meteor/meteor";
import { Deliveries } from "@olga/olga-collections";
import { Reaction } from "/server/api";
import { ReactiveAggregate } from "./reactiveAggregate";

// kts. server/publications/collections/orders.js
Meteor.publish("Deliveries", function() {
  if(this.userId === null)  {
      return this.ready();
  }

  if(!Reaction.getShopId()) {
      return this.ready();
  }

  if (Reaction.hasPermission("admin")) {
      return Deliveries.find({});
  }

  if (Reaction.hasPermission("supplier")) {
    return Deliveries.find({ userId: this.userId });
  }

  return this.ready();
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