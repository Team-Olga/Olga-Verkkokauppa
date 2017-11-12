import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Reaction } from "/client/api";
import { createContainer } from 'meteor/react-meteor-data';
import { Components, registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Products, Accounts } from "lib/collections";
import ProductItem from "./productItem";
import Columns from 'react-columns';

// App component - represents the whole app
class SupplierProductGridView extends Component {
  constructor(props) {
    super(props);
  }

  renderProducts() {
    return this.props.products.map((product) => {
      return (
        <ProductItem
          key={product._id}
          product={product}
        />
      );
    });
  }

  render() {
    var rootStyles = {
      flexDirection: "row",
      height: "100vh",
      position: "relative",
      width: "400px",
      minWidth: "400px",
      flex: "0 0 auto",
      backgroundColor: "white",
      overflow: "hidden",
      zIndex: "1050",
      transform: "translateX(0px)"
    };
    return (
      <div className="supplierProducts" style={{margin: "15px"}}>
        <Columns columns="2" className="admin-controls-content action-view-body" rootStyles={rootStyles}>
          {this.renderProducts()}
        </Columns>
      </div>
    );
  }
}

SupplierProductGridView.propTypes = {
  products: PropTypes.array.isRequired,
};

function composer(props, onData) {
  var userId = Meteor.userId();
  
  if (userId) {
    var account = Accounts.findOne(userId);
    var supplierProducts = account.products;
  } else {
    var supplierProducts = [];
  }

  onData(null, { 
    products: supplierProducts, 
    ...props });
}

registerComponent("SupplierProductGridView", SupplierProductGridView, composeWithTracker(composer));

export default composeWithTracker(composer)(SupplierProductGridView);