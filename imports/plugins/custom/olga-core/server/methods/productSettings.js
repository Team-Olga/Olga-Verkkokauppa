import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check"; 
import { Reaction } from "/server/api";
import { ProductSettings } from '@olga/olga-collections';
import { Mongo } from "meteor/mongo";

Meteor.methods({
  "product/settings/setProductionTime": function (productId, days) {
    check(productId, String);
    check(days, Number);

    if (!Reaction.hasPermission(["owner", "admin", "dashboard"], this.userId)) {
      throw new Meteor.Error("Access Denied");
    }

    var settings = ProductSettings.findOne({productId: productId});

    if (settings) {
      ProductSettings.update({ productId: productId }, 
        { $set: { "productionTime": days } },
      );
    } else {
      ProductSettings.insert({ productId: productId, productionTime: days });
    }

    const prod = ProductSettings.findOne({productId: productId});
  }
});