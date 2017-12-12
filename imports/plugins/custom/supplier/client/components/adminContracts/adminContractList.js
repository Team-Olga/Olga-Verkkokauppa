/*import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import ReactTable from "react-table";

import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';
import { SortableTablePagination } from "/imports/plugins/core/ui/client/components/table/sortableTableComponents";
import Avatar from "react-avatar";
import './styles.less';

import { ContractTotals, ProductTotals } from 'imports/plugins/custom/olga-core/lib/collections/collections';


class AdminContractList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: {},
    };
  }

  render() {   

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
        className: "contract-table-name-header"
      },
      {
        Header: "Tuotannossa",
        id: "production",
        Cell: info => (
          <div className="contract-total"> {info.original.production} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        className: "contract-table-mid-header" 
      },
      {
        Header: "Lähetetty",
        id: "delivery",
        Cell: info => (
          <div className="contract-total"> {info.original.delivery} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        className: "contract-table-mid-header"      
      },
      {
        Header: "Vastaanotettu",
        id: "received",
        Cell: info => (
          <div className="contract-total"> {info.original.received} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        className: "contract-table-mid-header" 
      },
      {
        Header: "Tuottajia",
        id: "suppliers",
        Cell: info => (
          <div className="contract-total"> {info.original.users.length} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        className: "contract-table-mid-header"
      }
    ];

    const supplierTotalsCol = [
      {
        Header: "",
        filterMethod: (filter, row) => (
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
        ),
        id: "supplier",
        Cell: row => (
          <div style={{ display: "inline-flex" }}>
            <Avatar
              email={row.original.user.email}
              round={true}
              name={row.original.user.name}
              size={25}
              className="rui-order-avatar"
            />
            <div className="supplier-full-name">
              <strong >
                {row.original.user.name}
              </strong>
            </div>
          </div>
        ),
      },
      {
        Header: "",
        id: "production",
        Cell: info => (
          <div className="contract-total  -left"> {info.original.production} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        headerClassName: 'contract-total-header -left'
      },
      {
        Header: "",
        id: "delivery",
        Cell: info => (
          <div className="contract-total -mid"> {info.original.delivery} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        headerClassName: 'contract-total-header -mid'
      },
      {
        Header: "",
        id: "received",
        Cell: info => (
          <div className="contract-total -right"> {info.original.received} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        headerClassName: 'contract-total-header -right'
      },
      {
        Header: "",
        id: "empty",
        Cell: info => (
          <div className="empty"> </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120
      }
    ];

    let getTheadProps = () => {
      return {
        className: "contract-table-thead"
      };
    };

    let getTheadThProps = () => {
      return {
        className: "contract-table-thead"
      };
    };

    let getTrGroupProps = () => {
      return {
        className: "contract-table-tr-group"
      };
    };

    let getTableProps = () => {
      return {
        className: "contract-table-list"
      };
    };

    let getTrProps = () => {
      return {
        className: "contract-table-detail-tr"
      };
    };


    return (
      <div className="contract-table-container">
        {_.isEmpty(this.props.productTotals) ?
        <div className='empty-view-message'> 
          No contracts found
        </div>
        :
        <ReactTable
          data={this.props.productTotals}
          columns={productTotalsCol}
          defaultPageSize={10}
          className="rui order table -highlight table-header-visible"
          minRows={1}
          expanded={this.state.expanded}
          onExpandedChange={expanded => this.setState({ expanded })}
          filterable
          headerClassName="contract-table-mid-header"
          getTableProps={getTableProps}
          getTheadProps={getTheadProps}
          getTrGroupProps={getTrGroupProps}
          getTheadThProps={getTheadThProps}
          getPaginationProps={() => {
            return {
              className: "order-table-pagination-visible"
            };
          }}
          PaginationComponent={SortableTablePagination}
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
                <div className="supplier-table-container">
                  <ReactTable
                    data={contractTotals}
                    columns={supplierTotalsCol}
                    className="rui order table supplier-table -highlight "
                    showPagination={false}
                    minRows={1}
                  />
                </div>
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

export default composeWithTracker(composer)(AdminContractList);*/