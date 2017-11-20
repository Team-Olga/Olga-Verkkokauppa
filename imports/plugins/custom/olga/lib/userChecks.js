import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import _ from "lodash";

export default class UserChecks {

    constructor() {}

    isInRole(role) {
        let loggedInUser = Meteor.user();
        let result = false;
        if(role === "supplier") {
            role = "supplierproducts";
        }
        // console.log("LoggedInUser: " + loggedInUser);
        // console.log("IsInRole: " + role + " " + Roles.userIsInRole(loggedInUser, role));
        if(loggedInUser) {
            if(Roles.userIsInRole(loggedInUser, role) || this.roleIsInArray(loggedInUser, role)) {
                result = true;
            }
        }
        return result;
    }

    roleIsInArray(loggedInUser, role) {
        if(loggedInUser.roles["J8Bhq3uTtdgwZx3rz"] && 
            _.indexOf(loggedInUser.roles["J8Bhq3uTtdgwZx3rz"], role ) > -1)
            return true; 
        }

    getAllRoles() {
        let loggedInUser = Meteor.user();
        if(loggedInUser) {
            let roles = loggedInUser.roles["J8Bhq3uTtdgwZx3rz"];
            return roles;
        }
        return [];
    }

}