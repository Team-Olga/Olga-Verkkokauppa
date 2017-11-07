import { Meteor } from "meteor/meteor";
import { Accounts, Products, Orders }  from "/lib/collections";
import { SupplyContracts } from "imports/plugins/custom/olga/lib/collections";


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
console.log("HELLO WORLD");

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
});


