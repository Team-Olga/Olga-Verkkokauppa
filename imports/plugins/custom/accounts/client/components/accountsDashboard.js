import React, { Component } from "react";
import PropTypes from "prop-types";
import { Components } from "@reactioncommerce/reaction-components";
import Modal from "react-modal";
import Select from "react-select";
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
      selectedOption: "",
      supplierProducts: [],
      products: products,
      itemModalIsOpen: false
    };

    this.openItemModal = this.openItemModal.bind(this);
    this.closeItemModal = this.closeItemModal.bind(this);
  }

  openItemModal(products) {
    this.setState({
      itemModalIsOpen: true,
      supplierProducts: products
    });

    let p = null;
    let i = 0;
    const setOptions = [];
    for (p in this.props.products) {
      setOptions[i] = { value: this.props.products[p], label: this.props.products[p].title };
      i++;
    }

    this.setState({ options: setOptions });

    console.log(setOptions);
  }

  closeItemModal() {
    this.setState({ itemModalIsOpen: false });
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

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Selected: ${selectedOption.label}`);
  }

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
          style={{
            overlay: {
              zIndex: 9999,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.75)"
            },
            content: {
              zIndex: 9999,
              position: "absolute",
              top: "40px",
              left: "40px",
              right: "40px",
              bottom: "40px",
              border: "1px solid #ccc",
              background: "#fff",
              overflow: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: "4px",
              outline: "none",
              padding: "20px"
            }
          }}
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
          <h2> Tutturuu </h2>
          <div>
            <Select
              name="itemModal-select"
              value={this.state.value}
              onChange={this.handleChange}
              options={this.state.options}
            />
            <button id="cancelItemModal" className="rui btn btn-primary flat olga-listing-btn-default pull-right"
              onClick={() => this.closeItemModal()}
            >Peruuta</button>
          </div>
        </Modal>

      </div>
    );
  }
}

export default AccountsDashboard;
