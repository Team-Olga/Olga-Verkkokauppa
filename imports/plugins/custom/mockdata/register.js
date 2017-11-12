import { Meteor } from "meteor/meteor";
import { Accounts, Products, Orders }  from "/lib/collections";
import { SupplyContracts } from "imports/plugins/custom/olga/lib/collections";
import { Accounts as AccountsBase } from "meteor/accounts-base";

import { Reaction, Hooks } from "/server/api";
import _ from 'lodash';


/*
Accounts:
supplier1@localhost
supplier2@localhost
password: test
*/

const supplierRoles = ["supplier", "customer", "supplierproducts", "supplierproductsreact"];
const defaultCustomerRoles = [ "guest", "account/profile", "product", "tag", "index", "cart/checkout", "cart/completed", "about"];
const defaultVisitorRoles = ["anonymous", "guest", "product", "tag", "index", "cart/checkout", "cart/completed", "about"];
const defaultSupplierRoles = supplierRoles.concat(defaultCustomerRoles);

function createSupplierUsers() {
  const shopId = "J8Bhq3uTtdgwZx3rz";
  const accounts = require('./Accounts.json');
  const products = Products.find({ ancestors: [], type: { $in: ["simple"] }, isVisible: true}, {sort: { createdAt: -1 }, limit: 6}).fetch();
  let i = 0;

  accounts.forEach((doc) => {
    if (Meteor.users.find({ "emails.address": doc.emails[0].address }).count() !== 0) {
      Meteor.users.remove({'emails.address': doc.emails[0].address});
    }

    if (Accounts.find({ "emails.address": doc.emails[0].address }).count() !== 0) {
      Accounts.remove({'emails.address': doc.emails[0].address});
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

    Roles.setUserRoles(accountId, defaultSupplierRoles, shopId);
  });
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

