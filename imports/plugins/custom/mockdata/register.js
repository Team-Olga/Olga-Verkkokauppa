import { Meteor } from "meteor/meteor";
import { Accounts, Products, Orders, Groups }  from "/lib/collections";
import { SupplyContracts } from "imports/plugins/custom/olga/lib/collections";
import { Accounts as AccountsBase } from "meteor/accounts-base";
import { Roles } from "meteor/alanning:roles";

import { Reaction, Hooks } from "/server/api";
import _ from 'lodash';


/*
Accounts:
supplier1@localhost
supplier2@localhost
password: test
*/

const supplierRoles = ["supplier", "supplier/products", "supplier/overview", "supplier/deliveries"];
const defaultCustomerRoles = [ "guest", "account/profile", "product", "tag", "index", "cart/checkout", "cart/completed", "about"];
const defaultVisitorRoles = ["anonymous", "guest", "product", "tag", "index", "cart/checkout", "cart/completed", "about"];
const defaultSupplierRoles = supplierRoles.concat(defaultCustomerRoles);

function createSupplierUsers() {
  const shopId = "J8Bhq3uTtdgwZx3rz";
  const accounts = require('./Accounts.json');
  const products = Products.find({ ancestors: [], type: { $in: ["simple"] }, isVisible: true}, {sort: { createdAt: -1 }, limit: 6}).fetch();
  let i = 0;

  accounts.forEach((doc) => {
    console.log("ADDING: " + doc.emails[0].address)

    if (Meteor.users.find({ "emails.address": doc.emails[0].address }).count() !== 0) {
      //Meteor.users.remove({'emails.address': doc.emails[0].address});
/*      console.log("Not adding: " + doc.emails[0].address)
      var user = Meteor.users.findOne({ "emails.address": doc.emails[0].address });
      const supplierGroup = Groups.findone({ slug: "supplier" });
      groupAddUser(user._id, supplierGroup._id);*/

      return;
    }

    if (Accounts.find({ "emails.address": doc.emails[0].address }).count() !== 0) {
      //Accounts.remove({'emails.address': doc.emails[0].address});
      //console.log("(Accounts) Not adding: " + doc.emails[0].address);
      return;
    }

    let supplierProducts = _.slice(products, i, i + 3);
    i = i + 1;

    let options = {};

    options.email = doc.emails[0].address;
    options.password = 'test';

    // create the new supplier user
    let accountId = AccountsBase.createUser(options);

    // update the user's name if it was provided
    // (since Accounts.createUser() doesn't allow that field and strips it out)
    Meteor.users.update(accountId, {
      $set: {
        name: doc.name,
        profile: doc.profile
      }
    });

    Accounts.update(accountId, {
      $set: {
        name: doc.profile.addressBook[0].fullName,
        profile: doc.profile,
        products: supplierProducts
      }
    });

    const supplierGroup = Groups.findone({ slug: "supplier" });

    groupAddUser(userId, supplierGroup._id);
    //Roles.setUserRoles(accountId, defaultSupplierRoles, shopId);
  });
}

function groupAddUser (userId, groupId) {    
  const group = Groups.findOne({ _id: groupId }) || {};
  const { permissions, shopId, slug } = group;
  const loggedInUserId = Meteor.userId();
  // make sure user only belongs to one group per shop
  const allGroupsInShop = Groups.find({ shopId }).fetch().map((grp) => grp._id);
  const user = Accounts.findOne({ _id: userId }) || {};
  const currentUserGroups = user.groups || [];
  let newGroups = [];
  let currentUserGrpInShop;

  currentUserGroups.forEach((grp) => {
    if (allGroupsInShop.indexOf(grp) < 0) {
      newGroups.push(grp);
    } else {
      currentUserGrpInShop = grp;
    }
  });

  newGroups = newGroups.concat(groupId);

  try {
    setUserPermissions({ _id: userId }, permissions, shopId);
    Accounts.update({ _id: userId }, { $set: { groups: newGroups } });

    return { status: 200 };
  } catch (error) {
    Logger.error(error);
    throw new Meteor.Error(500, "Could not add user");
  }
}

function setUserPermissions(users, permissions, shopId) {
  let affectedUsers = users;
  if (!Array.isArray(users)) {
    affectedUsers = [users];
  }

  return affectedUsers.forEach((user) => Roles.setUserRoles(user._id, permissions, shopId));
}

Meteor.methods({
  'createSuppliers'({}) {
    createSupplierUsers();
  }
});

Hooks.Events.add("afterCoreInit", () => {
  Meteor.call('createSuppliers', {}, 
    (err, res) => {
    if (err) {
      alert(err);
    } else {
      // success!
    }
  });
});

