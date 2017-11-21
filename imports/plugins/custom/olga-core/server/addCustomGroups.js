import { Roles } from "meteor/alanning:roles";
import { Shops, Groups }  from "/lib/collections";
import { Reaction } from "/lib/api";



const supplierRoles = [ "supplier",  "supplierproducts", "supplierproductsreact" ];
const defaultCustomerRoles = [ "guest", "account/profile", "product", "tag", "index", "cart/checkout", "cart/completed", "about"];
const defaultVisitorRoles = ["anonymous", "guest", "product", "tag", "index", "cart/checkout", "cart/completed", "about"];
export const defaultSupplierRoles = supplierRoles.concat(defaultCustomerRoles);

export function createCustomGroups() {
  const shopId = "J8Bhq3uTtdgwZx3rz";


  const allGroups = Groups.find({}).fetch();

  const roles = {
    "supplier": defaultSupplierRoles,
    "customer": Reaction.defaultCustomerRoles,
    "guest": Reaction.defaultVisitorRoles
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