import { Roles } from "meteor/alanning:roles";
import { Shops, Groups }  from "/lib/collections";
import { Reaction } from "/lib/api";


export const defaultSupplierRoles = [ "guest", "account/profile", "product", "tag", "index", "cart/checkout", "cart/completed"];

export function createCustomGroups() {
  const shopId = "J8Bhq3uTtdgwZx3rz";
  console.log('PRIMARY SHOPID: ' + shopId)

  const allGroups = Groups.find({}).fetch();

  const roles = {
    "supplier": defaultSupplierRoles,
  };

  Object.keys(roles).forEach(groupKeys => {
    const groupExists = allGroups.find(grp => grp.slug === groupKeys && grp.shopId === shopId);

    if (groupExists) {
      Groups.remove({'slug': groupKeys, 'shopId': shopId});
    }

    Groups.insert({
      name: groupKeys,
      slug: groupKeys,
      permissions: roles[groupKeys],
      shopId: shopId
    });
  });
};