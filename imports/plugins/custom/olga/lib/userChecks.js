import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import _ from "lodash";

export function isInRole(role) {
    let loggedInUser = Meteor.user();
    let result = false;
    if(role === "supplier") {
        role = "supplierproducts";
    }
    if(loggedInUser) {
        if(Roles.userIsInRole(loggedInUser, role) || roleIsInArray(loggedInUser, role)) {
            result = true;
        }
    }
    return result;
};

function roleIsInArray(loggedInUser, role) {
    if(loggedInUser.roles["J8Bhq3uTtdgwZx3rz"] && 
        _.indexOf(loggedInUser.roles["J8Bhq3uTtdgwZx3rz"], role ) > -1)
        return true; 
    }

export function getAllRoles() {
    let loggedInUser = Meteor.user();
    if(loggedInUser) {
        let roles = loggedInUser.roles["J8Bhq3uTtdgwZx3rz"];
        return roles;
    }
    return [];
}