import React, { Component } from "react";
import PropTypes from "prop-types";
import { Components } from "@reactioncommerce/reaction-components";
import { Reaction } from "/client/api";
import Login from "imports/plugins/core/accounts/client/components/login.js";

const iconStyle = {
  margin: "10px 10px 10px 6px",
  width: "20px",
  fontSize: "inherit",
  textAlign: "center"
};

const menuStyle = {
  padding: "0px 10px 10px 10px",
  minWidth: 220,
  minHeight: 50
};

class MainDropdown extends Component {
  static propTypes = {
    adminShortcuts: PropTypes.object,
    currentAccount: PropTypes.oneOfType(
      [PropTypes.bool, PropTypes.object]
    ),
    handleChange: PropTypes.func,
    userImage: PropTypes.oneOfType(
      [PropTypes.bool, PropTypes.string]
    ),
    userName: PropTypes.string,
    userShortcuts: PropTypes.object
  }

  buttonElement() {
    return (
      <Components.Button containerStyle={{ color: "#000", fontWeight: "normal", letterSpacing: 0.8 }}>
        <img className="accounts-img-tag" src={this.props.userImage} />&nbsp;
        <span>{this.props.userName}</span>&nbsp;
        <i className="fa fa-caret-down" />
      </Components.Button>
    );
  }

  renderAdminIcons() {
    return (
      Reaction.Apps(this.props.adminShortcuts).map((shortcut) => (
        <Components.MenuItem
          key={shortcut.packageId}
          className="accounts-a-tag"
          label={shortcut.label}
          i18nKeyLabel={shortcut.i18nKeyLabel}
          icon={shortcut.icon}
          iconStyle={iconStyle}
          value={shortcut}
        />
      ))
    );
  }

  renderUserIcons() {
    return (
      Reaction.Apps(this.props.userShortcuts).map((option) => (
        <Components.MenuItem
          key={option.packageId}
          className="accounts-a-tag"
          label={option.label}
          i18nKeyLabel={option.i18nKeyLabel}
          icon={option.icon && option.icon}
          iconStyle={iconStyle}
          value={option}
        />
      ))
    );
  }

  renderSupplierIcons() {
    return (
      Reaction.Apps(this.props.supplierShortcuts).map((products) => (
        <Components.MenuItem
          key={products.packageId}
          className="accounts-a-tag"
          label={products.label}
          i18nKeyLabel={products.i18nKeyLabel}
          icon={products.icon && products.icon}
          iconStyle={iconStyle}
          value={products}
        />
      ))
    );
  }

  renderSignOutButton() {
    return (
      <Components.MenuItem
        className="btn btn-primary btn-block accounts-btn-tag"
        label="Sign out"
        value="logout"
      />
    );
  }

  renderSignInComponent() {
    return (
      <div className="accounts-dropdown">
        <div className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-delay="1000">
          <span><Components.Translation defaultValue="Sign In" i18nKey="accountsUI.signIn" /></span><b className="caret" />
        </div>
        <div
          className="accounts-dialog accounts-layout dropdown-menu pull-right"
          style={{ padding: "10px 20px" }}
        >
          <Login />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="accounts">
        {this.props.currentAccount ?
          <div style={{ paddingRight: 5 }}>
            <Components.DropDownMenu
              buttonElement={this.buttonElement()}
              attachment="bottom right"
              targetAttachment="top right"
              menuStyle={menuStyle}
              className="accounts-li-tag"
              onChange={this.props.handleChange}
            >
              {this.renderUserIcons()}
              {this.renderAdminIcons()}
              {this.renderSupplierIcons()}
              {this.renderSignOutButton()}
            </Components.DropDownMenu>
          </div>
          :
          <div className="accounts dropdown" role="menu">
            {this.renderSignInComponent()}
          </div>
        }
      </div>
    );
  }
}

export default MainDropdown;
