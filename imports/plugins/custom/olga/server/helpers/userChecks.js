import { Meteor } from "meteor/meteor";
import { Reaction } from "/server/api";
import { Roles } from "meteor/alanning:roles";
import _ from "lodash";

export default class UserChecks {

    constructor() {}

    isInRole(role) {
        let loggedInUser = Meteor.user();
        let result = false;
        let shopId = Reaction.getShopId();
        if(loggedInUser) {
            if(Roles.userIsInRole(loggedInUser, role) || 
              this.userIsInGroup(loggedInUser, role) ||
              this.roleIsInArray(loggedInUser, role, shopId)) {
                result = true;
            }
        }
        return result;
    }

    roleIsInArray(loggedInUser, role, shopId) {
      // "J8Bhq3uTtdgwZx3rz"
        if(loggedInUser.roles[shopId] && 
            _.indexOf(loggedInUser.roles[shopId], role ) > -1)
            return true; 
        else
            return false;
    }

    userIsInGroup(loggedInUser, role) {
        console.log("Käyttäjän ryhmät:");
        console.log(Roles.getGroupsForUser(loggedInUser));
        if(Roles.getGroupsForUser(loggedInUser).indexOf(role) > 1)
            return true;
        else
            return false;
    }

    getAllRoles() {
        let loggedInUser = Meteor.user();
        let shopId = Reaction.getShopId();
        if(loggedInUser) {
            let roles = loggedInUser.roles[shopId];
            return roles;
        }
        return [];
    }

}