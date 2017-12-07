import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Components } from "@reactioncommerce/reaction-components";
import Modal from "react-modal";
import Select from "react-select";
import { default as sortUsersIntoGroups, sortGroups } from "imports/plugins/core/accounts/client/helpers/accountsHelper";
import AlertContainer from "react-alert";

class AccountsDashboard extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    adminGroups: PropTypes.array, // only admin groups
    groups: PropTypes.array, // all groups including non-admin default groups
    products: PropTypes.array,
    productsById: PropTypes.object
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

  alertOptions = {
    offset: 40,
    position: "top right",
    theme: "light",
    time: 5000,
    transition: "scale"
    }

  showAlert = (message, type) => {
    this.msg.show(message, {
      time: 5000,
      type: type
    });
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
    this.setOptions(products);
  };

  setOptions = (products) => {
    let p = null;
    let o = null;
    let i = 0;
    const options = [];
    const currentProductIds = [];

    for (o in products) {
      currentProductIds[o] = products[o]._id;
    }

    const currentProducts = _.omit(this.props.productsById, currentProductIds);

    for (p in currentProducts) {
      if (currentProducts[p].type === "simple") {
        options[i] = { label: currentProducts[p].title, value: currentProducts[p]._id };
        i++;
      }
    }

    this.setState({ options: options });
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

    if (this.state.value !== []) {
      const productList = [];
      const titles = [];

      for (const p in this.state.value) {
        productList.push(this.props.productsById[this.state.value[p].value]);
        titles.push(this.props.productsById[this.state.value[p].value].title);
      }
      const shopId = "J8Bhq3uTtdgwZx3rz";


      Meteor.call("accounts/productsUpdate", productList, this.state.currentAccount, shopId);
      this.setState({ value: [] });
      this.closeItemModal();
    }
  };

  removeProduct = (productId) => {
    Meteor.call("accounts/removeProduct", productId, this.state.currentAccount);
    let p = 0;
    const suppProds = this.state.supplierProducts;
    for (p in suppProds) {
      if (suppProds[p]._id === productId) {
        _.pullAt(suppProds, p);
      }
    }
    this.setState({ supplierProducts: suppProds });
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
            <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
            <ul>
              {this.state.supplierProducts.map((product) => {
                return <li key={product._id} id={product._id}>{product.title}<button
                  className="rui btn btn-primary olga-listing-btn-danger pull-right"
                  onClick={() => this.removeProduct(product._id)}
                >Poista</button></li>;
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
