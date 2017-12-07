import { Meteor } from "meteor/meteor";
import { ContractItems } from 'imports/plugins/custom/olga-core/lib/collections/collections';
import { Reaction } from "/server/api";
import { Accounts } from "/lib/collections";


Meteor.publish("ContractItems", function () {
  if (Reaction.hasPermission("admin")) {
    return ContractItems.find({});
  }

  if (Reaction.hasPermission("supplier")) {
    return ContractItems.find({});
  }

  return this.ready();
});