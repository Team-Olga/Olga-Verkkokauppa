import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import _ from "lodash";

export default class UserChecks {
  constructor() {}

  isInRole(role) {
    const loggedInUser = Meteor.user();
    let result = false;
    if (role === "supplier") {
      role = "supplierproducts";
    }
    if (loggedInUser) {
      if (Roles.userIsInRole(loggedInUser, role) || this.roleIsInArray(loggedInUser, role)) {
        result = true;
      }
    }
    return result;
  }

  roleIsInArray(loggedInUser, role) {
    if (loggedInUser.roles.J8Bhq3uTtdgwZx3rz &&
            _.indexOf(loggedInUser.roles.J8Bhq3uTtdgwZx3rz, role) > -1) {return true;}
  }

  getAllRoles() {
    const loggedInUser = Meteor.user();
    if (loggedInUser) {
      const roles = loggedInUser.roles.J8Bhq3uTtdgwZx3rz;
      return roles;
    }
    return [];
  }
}
