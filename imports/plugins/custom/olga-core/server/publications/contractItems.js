import { Meteor } from "meteor/meteor";
import { ContractItems } from '@olga/olga-collections';
import { Reaction } from "/server/api";


Meteor.publish("ContractItems", function () {
  if (Reaction.hasPermission("admin")) {
    return ContractItems.find({});
  }

  if (Reaction.hasPermission("supplier")) {
    return ContractItems.find({});
  }

  return this.ready();
});