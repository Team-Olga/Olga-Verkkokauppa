import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import ReactTable from "react-table";
import moment from "moment";

import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';
import { SortableTablePagination } from "/imports/plugins/core/ui/client/components/table/sortableTableComponents";
import Avatar from "react-avatar";

import { Products, Accounts } from "/lib/collections";
import { Deliveries, DeliveryProductTotals, DeliveryProductUserTotals } from '@olga/olga-collections';

import './styles.less';

class DeliverySummaryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //expanded: {}
    }
  }

  render() {
    console.log("Luodaan toimituslistaa");
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
        Header: "Lähetetty",
        id: "deliveredQuantity",
        Cell: info => (
          <div className="olga-total"> {info.original.deliveredQuantity} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        className: "contract-table-mid-header"
      },
      {
        Header: "Vastaanotettu",
        id: "receivedQuantity",
        Cell: info => (
          <div className="olga-total"> {info.original.receivedQuantity} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        className: "contract-table-mid-header"
      }
    ];

    const userTotalsCol = [
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
        id: "deliveredQuantity",
        Cell: info => (
          <div className="olga-total"> {info.original.deliveredQuantity} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        className: "contract-table-mid-header"
      },
      {
        Header: "",
        id: "receivedQuantity",
        Cell: info => (
          <div className="olga-total"> {info.original.receivedQuantity} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        className: "contract-table-mid-header"
      }
    ];

    const deliveryCol = [
      {
        Header: "",
        filterMethod: (filter, row) => (
          row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
        ),
        id: "deliveryDate",
        Cell: info => (
          <span className="supplier-full-name">
            {moment(info.original.createdAt).format("DD.MM.YYYY")}
          </span>
        )
      },
      {
        Header: "",
        id: "deliveryId",
        Cell: info => (
          <div className="contract-info"> {info.original._id} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 150,
        headerClassName: "contract-total-header -mid"
      },
      {
        Header: "",
        id: "recreateSlip",
        Cell: info => (
          <div 
            className="contract-info"
            onClick={() => {(true) ?
              this.props.resendPackingSlip(info.original._id)
              : {}
            }}
          >  
            <span>Meilaa lähetyslista</span>
          </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 150,
        headerClassName: "contract-total-header -mid"
      },
      {
        Header: "",
        id: "deliveredQuantity",
        Cell: info => (
          <div className="olga-total"> {info.original.deliveryQuantity} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        headerClassName: "contract-total-header -mid"
      },
      {
        Header: "",
        id: "receivedQuantity",
        Cell: info => (
          <div className="contract-total"> {info.original.receivedQuantity} </div>
        ),
        Filter: () => <span></span>,
        maxWidth: 120,
        headerClassName: "contract-total-header -mid"
      },
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
      <div className="delivery-subtable-container">
        {_.isEmpty(this.props.productDeliveryTotals) ?
        <div className='empty-view-message'>
          No deliveries found
        </div>
        :
        <ReactTable
          data={this.props.productDeliveryTotals}
          columns={productTotalsCol}
          defaultPageSize={10}
          className="rui order table -highlight table-header-visible"
          minRows={1}
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
            const userTotals = DeliveryProductUserTotals.find({
              productId: row.original.productId
            }).fetch();

            return (
              
                
                <div className="delivery-subtable-container">
                  <ReactTable
                    data={userTotals}
                    columns={userTotalsCol}
                    className="rui order table supplier-table -highlight"
                    showPagination={false}
                    minRows={1}
                    
                    SubComponent={row => {
                      const deliveries = Deliveries.find({
                        productId: row.original.productId,
                        userId: row.original.userId
                      }).fetch();

                      return(
                        
                          
                          <div className="delivery-subtable-container">
                            <ReactTable
                              data={deliveries}
                              columns={deliveryCol}
                              className="rui order table supplier-table -highlight"
                              showPagination={false}
                              minRows={1}
                            />
                          </div>
                          
                      );
                    }}
                  />
                </div>
                
            );
          }}
        />
        }
      </div>
    );
  }
}

DeliverySummaryList.propTypes = {
  productDeliveryTotals: PropTypes.arrayOf(PropTypes.object),
  productUserDeliveryTotals: PropTypes.arrayOf(PropTypes.object),
  resendPackingSlip: PropTypes.func
}

function composer(props, onData) {
  const productDeliveryTotalsSub = Meteor.subscribe("DeliveryProductTotals");
  const productUserDeliveryTotalsSub = Meteor.subscribe("DeliveryProductUserTotals");
  const productsSub = Meteor.subscribe("Products");
  const deliveriesSub = Meteor.subscribe("Deliveries");

  if(
    productDeliveryTotalsSub.ready() 
    && productUserDeliveryTotalsSub.ready()
    && productsSub.ready()
    && deliveriesSub.ready()
  ) {
      const productDeliveryTotals = DeliveryProductTotals.find({}).fetch();
      const productUserDeliveryTotals = DeliveryProductUserTotals.find({}).fetch();

    onData(null, {
      productDeliveryTotals: productDeliveryTotals,
      productUserDeliveryTotals: productUserDeliveryTotals,
      ...props
    });
  }
}

export default composeWithTracker(composer)(DeliverySummaryList);