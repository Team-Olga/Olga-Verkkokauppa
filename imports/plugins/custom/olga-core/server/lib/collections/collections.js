import { Meteor } from "meteor/meteor";
import { Accounts } from "/lib/collections";
import { registerSchema } from "@reactioncommerce/reaction-collections";
import *  as Schemas from "./schemas";


/**
 * Extending Accounts and Meteor.users with supplier-products
 * @ignore
 */
Accounts.attachSchema(Schemas.productlistSchema)

Meteor.users.schema = Accounts;