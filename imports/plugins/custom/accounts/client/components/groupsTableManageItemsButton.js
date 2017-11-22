import React from "react";
import PropTypes from "prop-types";
import { Components, registerComponent, withPermissions } from "@reactioncommerce/reaction-components";

/**
 * @summary React stateless component for "remove from group" button for groupTable
 * @param {Object} props - React PropTypes
 * @property {Object} account - User account object
 * @property {Object} group - Group data
 * @property {Function} handleManageItems - function to call on button click
 * @property {Boolean} hasPermissions - true or false depending on if user is granted access
 * @return {Node} React node containing wrapped button
 */
const GroupsTableManageItemsButton = ({ account, group, handleManageItems, hasPermissions }) => {
  if (group.slug === "owner") {
    return null;
  }

  if (!hasPermissions) {
    return null;
  }

  return (
    <div className="group-table-button">
      <Components.Button
        status="default"
        onClick={handleManageItems()}
        bezelStyle="solid"
        i18nKeyLabel="admin.groups.manageItems"
        label="Manage supplier items"
      />
    </div>
  );
};

GroupsTableManageItemsButton.propTypes = {
  account: PropTypes.object,
  group: PropTypes.object, // current group in interation
  handleManageItems: PropTypes.func,
  hasPermissions: PropTypes.bool
};

registerComponent("GroupsTableManageItemsButton", GroupsTableManageItemsButton, withPermissions({ roles: ["accounts"] }));

export default GroupsTableManageItemsButton;
