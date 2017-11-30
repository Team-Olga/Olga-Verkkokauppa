import React, { Component } from "react";
import PropTypes from "prop-types";
import { Components } from "@reactioncommerce/reaction-components";
import Modal from "react-modal";
import Select from "react-select";
import { Meteor } from "meteor/meteor";
import { default as sortUsersIntoGroups, sortGroups } from "imports/plugins/core/accounts/client/helpers/accountsHelper";

class AccountsDashboard extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    adminGroups: PropTypes.array, // only admin groups
    groups: PropTypes.array, // all groups including non-admin default groups
    products: PropTypes.array
  };

  constructor(props) {
    super(props);
    const { accounts, adminGroups, groups, products } = this.props;
    const sortedGroups = sortUsersIntoGroups({ groups: sortGroups(adminGroups), accounts }) || [];
    const defaultSelectedGroup = sortedGroups[0];


    this.state = {
      accounts: accounts,
      groups: sortGroups(groups),
      adminGroups: sortedGroups,
      selectedGroup: defaultSelectedGroup,
      options: [],
      value: [],
      currentAccount: {},
      selectedOption: [],
      supplierProducts: [],
      products: products,
      itemModalIsOpen: false
    };
    this.closeItemModal = this.closeItemModal.bind(this);
    this.openItemModal = this.openItemModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { adminGroups, accounts, groups } = nextProps;
    const sortedGroups = sortUsersIntoGroups({ groups: sortGroups(adminGroups), accounts });
    const selectedGroup = adminGroups.find((grp) => grp._id === (this.state.selectedGroup || {})._id);
    this.setState({
      adminGroups: sortedGroups,
      groups: sortGroups(groups),
      accounts,
      selectedGroup
    });
  }

  setOptions = () => {
    let p = null;
    let i = 0;
    const options = [];
    for (p in this.props.products) {
      if (this.props.products[p].type === "simple") {
        options[i] = { label: this.props.products[p].title, value: this.props.products[p]._id };
        i++;
      }
    }
    this.setState({ options: options });
  };

  openItemModal = (account) => {
    if (!this.state.itemModalIsOpen) {
      this.setState({
        itemModalIsOpen: true,
        currentAccount: account
      });
    } else {
      return;
    }

    const products = account.products;

    this.setState({
      supplierProducts: products
    });
    console.log(account.products);
    this.setOptions();
  };

  closeItemModal = () => {
    this.setState({
      itemModalIsOpen: false,
      currentAccount: {}
    });
  };

  handleGroupSelect = (group) => {
    this.setState({ selectedGroup: group });
  };

  handleMethodLoad = () => {
    this.setState({ loading: true });
  };

  handleMethodDone = () => {
    this.setState({ loading: false });
  };

  renderGroupDetail = () => {
    const { groups, adminGroups, accounts } = this.state;
    return (
      <Components.ManageGroups
        {...this.props}
        group={this.state.selectedGroup}
        groups={groups}
        adminGroups={adminGroups}
        accounts={accounts}
        onChangeGroup={this.handleGroupSelect}
      />
    );
  };

  postSelection = () => {
    const productList = [];

    let i = 0;
    let j = 0;
    while (i < this.state.value.length) {
      if (this.state.value[i].value === this.props.products[j]._id) {
        productList[i] = this.props.products[j];
        i++;
      }
      j++;
    }

    console.log(productList);

    Meteor.call("accounts/productsUpdate", productList, this.state.currentAccount);
    this.setState({ value: [] });
    this.closeItemModal();
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  renderGroupsTable(groups) {
    if (Array.isArray(groups)) {
      return (
        <div className="group-container">
          {this.state.loading && <Components.Loading />}
          {groups.map((group, index) => {
            return (
              <Components.GroupsTable
                {...this.props}
                key={index}
                group={group}
                onMethodLoad={this.handleMethodLoad}
                onMethodDone={this.handleMethodDone}
                onGroupSelect={this.handleGroupSelect}
                openItemModal={this.openItemModal}
              />
            );
          })}
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="row list-group accounts-table">
        <div className="col-md-9">
          {this.renderGroupsTable(this.state.adminGroups)}
        </div>
        <div className="col-md-3">
          {this.renderGroupDetail()}
        </div>

        <Modal
          isOpen={this.state.itemModalIsOpen}
          onRequestClose={this.state.closeItemModal}
          contentLabel={"Osoita tuotteita toimittajalle"}
          className={{
            base: "itemModal",
            afterOpen: "itemModal_after-open",
            beforeClose: "itemModal_before-close"
          }}
          overlayClassName={{
            base: "itemModalOverlay",
            afterOpen: "itemModalOverlay_after-open",
            beforeClose: "itemModalOverlay_before-close"
          }}
        >
          <h2> Lisää tai poista tuotteita tavarantoimittajalta </h2>
          <div>
            <Select
              name="itemModal-select"
              value={this.state.value}
              multi
              onChange={this.handleChange}
              options={this.state.options}
              joinValues
            />
            <button id="cancelItemModal" className="rui btn btn-primary flat olga-listing-btn-default pull-right"
              onClick={() => this.closeItemModal()}
            >Peruuta</button>
          </div>
          <div>
            <button id="confirmSelection" className="rui btn btn-primary olga-listing-btn-success pull-right"
              onClick={() => this.postSelection()}
            >Lähetä</button>
            <ul>
              {this.state.supplierProducts.map((product) => {
                return <li>{product.label}</li>;
              }
              )}
            </ul>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AccountsDashboard;
