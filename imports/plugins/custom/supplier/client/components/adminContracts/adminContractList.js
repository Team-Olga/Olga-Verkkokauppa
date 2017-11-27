import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import ReactTable from "react-table";
import './styles.less';

import { ContractTotals, ProductTotals } from 'imports/plugins/custom/olga-core/lib/collections/collections';
import ReactTransitionGroup from 'react-addons-css-transition-group'; // ES6
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

class AdminContractList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: {},
    };
  }

  render() {   
    const util = require('util'); 
    const productTotalsCol = [
      {
        Header: "Tuote",
        filterMethod: (filter, row) => (
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
        ),
        id: "productTitle",
        accessor: d => d.product.title,
        Cell: info => (
          <span className="product-name"> {info.original.product.title} </span>
        ),
      },
      {
        Header: "Tuotannossa",
        id: "production",
        Cell: info => (
          <div className="contract-total"> {info.original.production} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 190
      },
      {
        Header: "Lähetetty",
        id: "delivery",
        Cell: info => (
          <div className="contract-total"> {info.original.delivery} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 190
      },
      {
        Header: "Vastaanotettu",
        id: "received",
        Cell: info => (
          <div className="contract-total"> {info.original.received} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 190
      },
      {
        Header: "Tuottajia",
        id: "suppliers",
        Cell: info => (
          <div className="contract-total"> {info.original.users.length} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 190
      }
    ];

    const supplierTotalsCol = [
      {
        Header: "",
        id: "empty",
        Cell: info => (
          <div className="empty"> </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 35
      },
      {
        Header: "",
        filterMethod: (filter, row) => (
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
        ),
        id: "supplier",
        Cell: info => (
          <span className="product-name"> {info.original.user.name} </span>
        ),
      },
      {
        Header: "",
        id: "production",
        Cell: info => (
          <div className="contract-total"> {info.original.production} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 190
      },
      {
        Header: "",
        id: "delivery",
        Cell: info => (
          <div className="contract-total"> {info.original.delivery} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 190
      },
      {
        Header: "",
        id: "received",
        Cell: info => (
          <div className="contract-total"> {info.original.received} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 190
      },
      {
        Header: "",
        id: "empty",
        Cell: info => (
          <div className="empty"> </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 190
      }
    ];

    return (
      <div >
        {_.isEmpty(this.props.productTotals) ?
        <div className='empty-view-message'> 
          No contracts found
        </div>
        :
        <ReactTable
          data={this.props.productTotals}
          columns={productTotalsCol}
          defaultPageSize={10}
          className="OlgaTable -highlight -striped"
          minRows={1}
          expanded={this.state.expanded}
          onExpandedChange={expanded => this.setState({ expanded })}
          filterable
          SubComponent={row => {
            const contractTotals = ContractTotals.find({
              productId: row.original.productId
            }).fetch();

            return (
             <VelocityTransitionGroup
                enter={{animation: "slideDown", delay:10, duration: 400, easing: "ease-in-out"}}
                leave={{animation: "slideUp", duration: 600, easing: "ease-in-out"}}
                runOnMount={true}
              >
                {this.state.expanded[row.index] !== false ? 
                  <ReactTable
                    data={contractTotals}
                    columns={supplierTotalsCol}
                    className="OlgaTable SubTable -highlight -striped"
                    showPagination={false}
                    minRows={1}
                  />
                : undefined
                }
              </VelocityTransitionGroup>
            );
          }}
        />
        }
      </div>
    );
  }    
}

AdminContractList.propTypes = {
    supplierTotals: PropTypes.arrayOf(PropTypes.object),
    productTotals: PropTypes.arrayOf(PropTypes.object)
}

function composer(props, onData) {
  const contractTotalSub = Meteor.subscribe("ContractTotals");
  const productTotalSub = Meteor.subscribe("ProductTotals");
  const productSub = Meteor.subscribe("Products");

  if (contractTotalSub.ready() && productSub.ready() && 
      productTotalSub.ready()) {

    const productTotals = ProductTotals.find({}).fetch();

    onData(null, { 
      productTotals: productTotals, 
      ...props });
  }
}


registerComponent("AdminContractList", AdminContractList, composeWithTracker(composer));

export default composeWithTracker(composer)(AdminContractList);