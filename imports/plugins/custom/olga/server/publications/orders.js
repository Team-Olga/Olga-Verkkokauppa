import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Roles } from "meteor/alanning:roles";
import UserChecks from "../helpers/userChecks";
import { ReactiveAggregate } from "./reactiveAggregate";
import { Orders } from "/lib/collections";
import { Reaction } from "/server/api";

// Basically copied over from Reaction's own Orders publication: /server/publications/collections/orders.js

/**
 * A shared way of creating a projection
 * @param {String} shopId - shopId to filter records by
 * @param {Object} sort - An object containing a sort
 * @param {Number} limit - An optional limit of how many records to return
 * @returns {Array} An array of projection operators
 * @private
 */
function createAggregate(shopId, sort = { createdAt: -1 }, limit = 0) {
  // NOTE: in Mongo 3.4 using the $in operator will be supported for projection filters
  const aggregate = [
    { $match: { "items.shopId": shopId } },
    {
      $project: {
        items: {
          $filter: {
            input: "$items",
            as: "item",
            cond: { $eq: ["$$item.shopId", shopId] }
          }
        },
        billing: {
          $filter: {
            input: "$billing",
            as: "billing",
            cond: { $eq: ["$$billing.shopId", shopId] }
          }
        },
        shipping: {
          $filter: {
            input: "$shipping",
            as: "shipping",
            cond: { $eq: ["$$shipping.shopId", shopId] }
          }
        },
        cartId: 1,
        sessionId: 1,
        shopId: 1, // workflow is still stored at the top level and used to showing status
        workflow: 1,
        discount: 1,
        tax: 1,
        email: 1,
        createdAt: 1,
        userId: 1,
        productSupplies: 1
      }
    },
    { $sort: sort }
  ];

  if (limit > 0) {
    aggregate.push({ $limit: limit });
  }
  return aggregate;
}

Meteor.publish("SupplierOrders", function () {
  let userChecks = new UserChecks();

  if (this.userId === null) {
    return this.ready();
  }
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }

  // return any order for which the shopId is attached to an item
  const aggregateOptions = {
    observeSelector: {
      "items.shopId": shopId
    }
  };
  const aggregate = createAggregate(shopId);

  //if (Roles.userIsInRole(this.userId, ["admin", "owner", "orders", "supplier"], shopId)) {
  if(userChecks.isInRole("admin") || userChecks.isInRole("supplier")) {
    ReactiveAggregate(this, Orders, aggregate, aggregateOptions);
  } else {
    return Orders.find({
      shopId: shopId,
      userId: this.userId
    });
  }
});