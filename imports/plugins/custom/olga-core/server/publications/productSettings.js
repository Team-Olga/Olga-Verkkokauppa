import { Meteor } from "meteor/meteor";
import { ProductSettings } from '@olga/olga-collections';
import { Reaction } from "/server/api";


Meteor.publish("ProductSettings", function () {
  if (Reaction.hasPermission("admin")) {
    return ProductSettings.find({});
  }

  return this.ready();
});