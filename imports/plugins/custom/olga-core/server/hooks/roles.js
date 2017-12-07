import { Reaction, Hooks } from "/server/api";

Hooks.Events.add("afterCoreInit", () => {
  Reaction.addRolesToGroups({
    allShops: true,
    groups: ["supplier"],
    roles: [
      "account/verify", 
      "reaction-paypal/paypalDone", 
      "reaction-paypal/paypalCancel", 
      "stripe/connect/authorize"
    ]
  });
});