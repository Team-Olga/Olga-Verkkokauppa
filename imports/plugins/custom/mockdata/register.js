import { Meteor } from "meteor/meteor";
import { Accounts, Products, Orders }  from "/lib/collections";
import { SupplyContracts } from "imports/plugins/custom/olga/lib/collections";
import { Accounts as AccountsBase } from "meteor/accounts-base";

import { Reaction, Hooks } from "/server/api";


/*
Accounts:
supplier1@localhost
...
supplier10@localhost
password: test

customer@localhost
customer2@localhost
custome3@localhost
password: test
*/
/*console.log("HELLO WORLD");

var accounts = require('./Accounts.json');

const allAccounts = Meteor.users.find({}).fetch();

accounts.forEach((doc) => {
  const accountExists = allAccounts.find(acc => acc._id === doc._id);
  
  if (accountExists) {
    Meteor.users.remove({'_id': doc._id});
    console.log('Removing account: ' + doc._id);
  }
  console.log(doc);
  
  Meteor.users.insert(doc);
});*/

function createSupplierUsers() {
  const shopId = "J8Bhq3uTtdgwZx3rz";
  const accounts = require('./Accounts.json');
  console.log(accounts);

  const allAccounts = Meteor.users.find({}).fetch();

  accounts.forEach((doc) => {
    console.log('Adding account: ' + doc.emails[0].address);
    if (Meteor.users.find({ "emails.address": doc.emails[0].address }).count() !== 0) {
      Meteor.users.remove({'emails.address': doc.emails[0].address});
      console.log('Removing account: ' + doc.emails[0].address);
    }

    if (Accounts.find({ "emails.address": doc.emails[0].address }).count() !== 0) {
      Meteor.users.remove({'emails.address': doc.emails[0].address});
      console.log('Removing account: ' + doc.emails[0].address);
    }

    let options = {};

    // defaults use either env or generated values
    options.email = doc.emails[0].address;
    options.password = 'test';
    //options.username = doc.emails[0].address.split('@')[0];
    //options.name = doc.name;

    // create the new supplier user
    let accountId = AccountsBase.createUser(options);
    console.log('Created account with id: ' + accountId);

    // update the user's name if it was provided
    // (since Accounts.createUser() doesn't allow that field and strips it out)
    Meteor.users.update(accountId, {
      $set: {
        name: doc.name
      }
    });

/*    Roles.setUserRoles(accountId, 
      [ "supplier", 
        "guest",
        "account/profile",
        "product",
        "tag",
        "index",
        "cart/checkout",
        "cart/completed",
        "notifications",
        "reaction-paypal/paypalDone",
        "reaction-paypal/paypalCancel",
        "stripe/connect/authorize",
      ], Roles.GLOBAL_GROUP);*/


/*    Meteor.users.update(accountId, {
      $set: {
        profile: doc.profile
      }
    });*/
/*    Roles.setUserRoles(accountId, ownerRoles, shopId);

    // unless strict security is enabled, mark the admin's email as validated
    if (!isSecureSetup) {
      Meteor.users.update({
        "_id": accountId,
        "emails.address": options.email
      }, {
        $set: {
          "emails.$.verified": true
        }
      });
    } else {
      // send verification email to admin
      sendVerificationEmail(accountId);
    }*/

    //const defaultSupplierRoles = ["supplier"];

    // Set default owner roles
    //const defaultAdminRoles = ["owner", "admin", "guest", "account/profile"];
    // Join other roles with defaultAdminRoles for owner.
    // this is needed as owner should not just have "owner" but all other defined roles
    //let ownerRoles = defaultAdminRoles.concat(this.defaultCustomerRoles);
    //ownerRoles = _.uniq(ownerRoles);

    // we don't use accounts/addUserPermissions here because we may not yet have permissions
    //Roles.setUserRoles(accountId, ownerRoles, shopId);
    // // the reaction owner has permissions to all sites by default
    
  });
}

Meteor.methods({
  'createSuppliers'({}) {
    createSupplierUsers();
  }
});

Meteor.call('createSuppliers', {}, 
  (err, res) => {
  if (err) {
    alert(err);
  } else {
    // success!
  }
});
