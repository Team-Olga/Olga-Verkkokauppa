import { Reaction } from "/server/api";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
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
  }
};

Meteor.methods(methods);
