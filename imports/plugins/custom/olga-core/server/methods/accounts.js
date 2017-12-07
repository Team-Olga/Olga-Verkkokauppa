import { Reaction } from "/server/api";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import _ from "lodash";
import { Products, Accounts } from "lib/collections";

export const methods = {
  "accounts/productsUpdate": function (productList, account, shopId) {
    // const userId = Meteor.userId();

    check(productList, Array);
    check(account, Object);
    check(shopId, String);


    if (!Reaction.hasAdminAccess()) {
      throw new Meteor.Error(403, "Access Denied");
    }

    Accounts.update({ _id: account._id },
      { $addToSet: {
        products: { $each: productList } } });
  },

  "accounts/removeProduct": function (productId, account) {
    check(productId, String);
    check(account, Object);

    console.dir(productId);
    if (!Reaction.hasAdminAccess()) {
      throw new Meteor.Error(403, "Access Denied");
    }
    const acc = Accounts.findOne({_id: account._id});

    const prods = acc.products;
    let p = 0;
    for (p in prods) {
      if (prods[p]._id === productId) {
        _.pullAt(prods, p);
      }
    }

    Accounts.update({ _id: account._id },
      { $set: {
        products: prods
      } });
  }
};

Meteor.methods(methods);
