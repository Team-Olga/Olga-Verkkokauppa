import { compose, withProps } from "recompose";
import Alert from "sweetalert2";
import _ from "lodash";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Accounts, Groups, Products } from "/lib/collections";
import { Reaction, i18next } from "/client/api";
import AccountsDashboard from "../components/accountsDashboard";

const handlers = {
  handleUserGroupChange({ account, ownerGrpId, onMethodLoad, onMethodDone }) {
    return (event, groupId) => {
      if (onMethodLoad) { onMethodLoad(); }

      if (groupId === ownerGrpId) {
        return alertConfirm()
          .then(() => {
            return updateMethodCall(groupId);
          })
          .catch(() => {
            if (onMethodDone) { onMethodDone(); }
          });
      }

      return updateMethodCall(groupId);
    };

    function updateMethodCall(groupId) {
      Meteor.call("group/addUser", account._id, groupId, (err) => {
        if (err) {
          Alerts.toast(i18next.t("admin.groups.addUserError", { err: err.message }), "error");
        }
        if (!err) {
          Alerts.toast(i18next.t("admin.groups.addUserSuccess"), "success");
        }
        if (onMethodDone) { onMethodDone(); }
      });
    }

    function alertConfirm() {
      let changeOwnerWarn = "changeShopOwnerWarn";
      if (Reaction.getShopId() === Reaction.getPrimaryShopId()) {
        changeOwnerWarn = "changeMktOwnerWarn";
      }
      return Alert({
        title: i18next.t("admin.settings.changeOwner"),
        text: i18next.t(`admin.settings.${changeOwnerWarn}`),
        type: "warning",
        showCancelButton: true,
        cancelButtonText: i18next.t("admin.settings.cancel"),
        confirmButtonText: i18next.t("admin.settings.continue")
      });
    }
  },

  handleRemoveUserFromGroup(account, groupId) {
    return () => {
      alertConfirm()
        .then(() => {
          return removeMethodCall();
        })
        .catch(() => false);

      function removeMethodCall() {
        Meteor.call("group/removeUser", account._id, groupId, (err) => {
          if (err) {
            return Alerts.toast(i18next.t("admin.groups.removeUserError", { err: err.message }), "error");
          }
          return Alerts.toast(i18next.t("admin.groups.removeUserSuccess"), "success");
        });
      }
    };

    function alertConfirm() {
      return Alert({
        title: i18next.t("admin.settings.removeUser"),
        text: i18next.t("admin.settings.removeUserWarn"),
        type: "warning",
        showCancelButton: true,
        cancelButtonText: i18next.t("admin.settings.cancel"),
        confirmButtonText: i18next.t("admin.settings.continue")
      });
    }
  }
};

const composer = (props, onData) => {
  const shopId = Reaction.getShopId();
  const adminUserSub = Meteor.subscribe("Accounts", null);
  const grpSub = Meteor.subscribe("Groups");
  const productSubscription = Meteor.subscribe("Products");

  if (adminUserSub.ready() && grpSub.ready() && productSubscription.ready()) {
    const groups = Groups.find({
      shopId: Reaction.getShopId()
    }).fetch();

    const adminQuery = {
      [`roles.${shopId}`]: {
        $in: ["dashboard", "supplier"]
      }
    };

    const adminUsers = Meteor.users.find(adminQuery, { fields: { _id: 1 } }).fetch();
    // Otetaa tähän hetkee viel kaikki
    const products = Products.find({ type: "simple" }).fetch();
    const productsById = _.keyBy(products, product => product._id);
    const ids = adminUsers.map((user) => user._id);
    const accounts = Accounts.find({ _id: { $in: ids } }).fetch();
    const adminGroups = groups.reduce((admGrps, group) => {
      if (group.slug !== "customer" && group.slug !== "guest") {
        admGrps.push(group);
      }
      return admGrps;
    }, []);

    onData(null, { accounts, groups, adminGroups, products, productsById });
  }
};

registerComponent("AccountsDashboard", AccountsDashboard, [
  composeWithTracker(composer),
  withProps(handlers)
]);

export default compose(
  composeWithTracker(composer),
  withProps(handlers)
)(AccountsDashboard);
