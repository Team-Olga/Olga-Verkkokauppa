import { Meteor } from "meteor/meteor";
import { ProductSettings } from 'imports/plugins/custom/olga-core/lib/collections/collections';
import { Reaction } from "/server/api";


Meteor.publish("ProductSettings", function () {
  if (Reaction.hasPermission("admin")) {
    return ProductSettings.find({});
  }

  return this.ready();
});