import { Shops } from "/lib/collections";
import { Hooks, Reaction} from "/server/api";

function addRolesToVisitors() {
  const shop = Shops.findOne(Reaction.getShopId());
  Shops.update(shop._id, {
    $addToSet: { defaultVisitorRole: "homepage" }
  });
  Shops.update(shop._id, {
    $addToSet: { defaultRole: "homepage" }
  });
}

Hooks.Events.add("afterCoreInit", () => {
  addRolesToVisitors();
});
