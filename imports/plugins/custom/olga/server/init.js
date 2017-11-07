import { check } from "meteor/check";
import { Shops } from "/lib/collections";
import { Hooks, Reaction, Logger } from "/server/api";
import "./publications";


function addRolesToVisitors() {
  const shop = Shops.findOne(Reaction.getShopId());
  Shops.update(shop._id, {
    $addToSet: { defaultVisitorRole: "supplierproducts" }
  });
  Shops.update(shop._id, {
    $addToSet: { defaultVisitorRole: "supplierproductsreact" }
  });
  Shops.update(shop._id, {
    $addToSet: { defaultRole: "supplierproducts" }
  });
  Shops.update(shop._id, {
    $addToSet: { defaultRole: "supplierproductsreact" }
  });
}

/*function changeLayouts(shopId, newLayout) {
  check(shopId, String);
  check(newLayout, String);
  Logger.info(`::: changing all layouts to ${newLayout}`);
  const shop = Shops.findOne(shopId);
  for (let i = 0; i < shop.layout.length; i++) {
    shop.layout[i].layout = newLayout;
  }
  return Shops.update(shopId, {
    $set: { layout: shop.layout }
  });
}*/

Hooks.Events.add("afterCoreInit", () => {
  addRolesToVisitors();
  //changeLayouts(Reaction.getShopId(), "CoreLayoutOlga");
});
