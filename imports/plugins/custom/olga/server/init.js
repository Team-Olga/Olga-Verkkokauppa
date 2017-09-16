import { Shops } from "/lib/collections";
import { Hooks, Reaction } from "/server/api";

function addRolesToVisitors() {
    const shop = Shops.findOne(Reaction.getShopId());
    Shops.update(shop._id, {
        $addToSet: { "defaultVisitorRole": "supplierproducts" }
    });
    Shops.update(shop._id, {
        $addToSet: { "defaultRole": "supplierproducts"}
    });
}

Hooks.Events.add("afterCoreInit", () => {
    addRolesToVisitors();
});