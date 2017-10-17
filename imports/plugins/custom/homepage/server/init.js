import { Shops } from "/lib/collections";
import { Hooks, Reaction} from "/server/api";

function addRolesToVisitors() {
  const shop = Shops.findOne(Reaction.getShopId());
  Shops.update(shop._id, {
    $addToSet: { defaultVisitorRole: "home" }
  });
  Shops.update(shop._id, {
    $addToSet: { defaultRole: "home" }
  });
}

Hooks.Events.add("afterCoreInit", () => {
  addRolesToVisitors();
});
