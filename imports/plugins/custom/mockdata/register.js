import { Meteor } from "meteor/meteor";
import { Accounts, Products, Orders }  from "/lib/collections";
import { SupplyContracts } from "imports/plugins/custom/olga/lib/collections";
import { Accounts as AccountsBase } from "meteor/accounts-base";

import { Reaction, Hooks } from "/server/api";


/*
Accounts:
supplier1@localhost
supplier2@localhost
password: test
*/

const supplierRoles = [ "customer",  "/supplierproducts", "/supplierproductsreact" ];
const defaultCustomerRoles = [ "guest", "account/profile", "product", "tag", "index", "cart/checkout", "cart/completed", "about"];
const defaultVisitorRoles = ["anonymous", "guest", "product", "tag", "index", "cart/checkout", "cart/completed", "about"];
const defaultSupplierRoles = supplierRoles.concat(defaultCustomerRoles);

function createSupplierUsers() {
  const shopId = "J8Bhq3uTtdgwZx3rz";
  const accounts = require('./Accounts.json');

  accounts.forEach((doc) => {
    console.log('Adding account: ' + doc.emails[0].address);
    if (Meteor.users.find({ "emails.address": doc.emails[0].address }).count() !== 0) {
      Meteor.users.remove({'emails.address': doc.emails[0].address});
      console.log('Removing account: ' + doc.emails[0].address);
    }

    if (Accounts.find({ "emails.address": doc.emails[0].address }).count() !== 0) {
      Meteor.users.remove({'emails.address': doc.emails[0].address});
      console.log('Removing account 2: ' + doc.emails[0].address);
    }

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
        profile: doc.profile
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

