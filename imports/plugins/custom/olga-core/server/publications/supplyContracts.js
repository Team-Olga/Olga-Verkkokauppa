import { Meteor } from "meteor/meteor";
import { SupplyContracts } from '@olga/olga-collections';
import { Reaction } from "/server/api";


Meteor.publish("SupplyContracts", function () {
  if(this.userId === null)  {
      return this.ready();
  }

  if(!Reaction.getShopId()) {
      return this.ready();
  }

  if (Reaction.hasPermission("admin")) {
    return SupplyContracts.find({});
  }

  if (Reaction.hasPermission("supplier")) {
    return ContractItems.find({ userId: this.userId });
  }

  return this.ready();
});