import { Roles } from "meteor/alanning:roles";
import { Shops, Groups}  from "/lib/collections";


export const defaultProducerRoles = [ "guest", "account/profile", "product", "tag", "index", "cart/checkout", "cart/completed"];

export function createCustomGroups(options = {}) {
  const self = this;
  const { shopId } = options;
  const allGroups = Groups.find({}).fetch();
  const query = {};

  if (shopId) {
    query._id = shopId;
  }

  const shops = Shops.find(query).fetch();

  const roles = {
    "producer": defaultProducerRoles,
  };

  if (shops && shops.length) {
    shops.forEach(shop => createGroupsForShop(shop));
  }

  function createGroupsForShop(shop) {
    Object.keys(roles).forEach(groupKeys => {
      const groupExists = allGroups.find(grp => grp.slug === groupKeys && grp.shopId === shop._id);

      if (groupExists) {
        Groups.remove({'slug': groupKeys, 'shopId': shop._id});
      }

      Groups.insert({
        name: groupKeys,
        slug: groupKeys,
        permissions: roles[groupKeys],
        shopId: shop._id
      });
    });
  };
};