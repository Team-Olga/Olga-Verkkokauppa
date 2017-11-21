import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import ReactTable from "react-table";
import ContractListItem from "./contractItem";
import './styles.less';

import { ContractTotals } from 'imports/plugins/custom/olga-core/lib/collections/collections';

class ContractList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
/*    const contractColumns = [{
      Header: "",
      accessor: "productName",
      Cell: contractTotals => (
        <ContractListItem className="olga-row"
          contractTotals={contractTotals.original}
        />
      )
    }];*/
    const contractColumns = [
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
        //maxWidth: 600
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
        Filter: ({ filter, onChange }) => <span></span>,
        maxWidth: 190
      },
      {
        Header: "Vastaanotettu",
        id: "received",
        Cell: info => (
          <div className="contract-total"> {info.original.received} </div>
        ),
        Filter: ({ filter, onChange }) => <span></span>,
        maxWidth: 190
      }
    ];

    return (
      <div >
        {_.isEmpty(this.props.contractTotals) ?
        <div className='empty-view-message'> 
          No contracts found
        </div>
        :
        <ReactTable
          data={this.props.contractTotals}
          columns={contractColumns}
          defaultPageSize={10}
          className="OlgaTable -highlight -striped"
          minRows={1}
          filterable
        />
        }
      </div>
    );
  }    
}

ContractList.propTypes = {
    contractTotals: PropTypes.arrayOf(PropTypes.object),
}

function composer(props, onData) {
  const util = require('util');

  const contractTotalSub = Meteor.subscribe("ContractTotals");
  const productSub = Meteor.subscribe("Products");


  if (contractTotalSub.ready() && productSub.ready()) {
    const totals = ContractTotals.find({}).fetch();

    console.log('hello: ' + util.inspect(totals, false, null));

    onData(null, { 
      contractTotals: totals, 
      ...props });
  }
}


registerComponent("ContractList", ContractList, composeWithTracker(composer));

export default composeWithTracker(composer)(ContractList);