import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import ReactTable from "react-table";
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';
import { SortableTablePagination } from "/imports/plugins/custom/ui/client/components/table/sortableTableComponents";
import Avatar from "react-avatar";
import ProductImage from "./productImage"
import './styles.less';

import { Products, Accounts, Groups, Media } from "/lib/collections";
import { ContractItems, SupplierTotals } from 'imports/plugins/custom/olga-core/lib/collections/collections';

import { getProductVariants, getVariantOptions, 
         getProductSummary, getVariantSummary } from '../../helpers/productOverview';


import AccountDetails from './accountDetails';

class SupplierSummaryList extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * Media - find media based on a product/variant
   * @param  {Object} item object containing a product and variant id
   * @return {Object|false} An object contianing the media or false
   */
  handleDisplayMedia = (product) => {
    const defaultImage = Media.findOne({
      "metadata.productId": product._id,
      "metadata.priority": 0
    });

    return defaultImage;
  }

/*  renderDetailView() {
    return <AccountDetails supplier={this.props.supplier}/>
  }
*/
  

  renderProducts(supplier) {
    const { displayMedia } = this.props;
    //const invoice = getBillingInfo(order).invoice || {};

    return (
      <div className="order-info">
        <div className="order-totals">
{/*          <span className="order-data order-data-id">
            <strong>Supplier ID: </strong>
             <ClickToCopy
              copyToClipboard={supplier._id}
              displayText={supplier._id}
              i18nKeyTooltip="admin.orderWorkflow.summary.copyOrderLink"
              tooltip="Copy Order Link"
            />
          </span>*/}

{/*          <span className="order-data order-data-total">
            <strong>Total: {formatPriceString(invoice.total)}</strong>
          </span>*/}
        </div>

        <div className="order-items">
          {supplier.products.map((item, i) => {
            return (
              <div className="order-item" key={i}>
                <div className="order-item-media">
                  <ProductImage
                    item={item}
                    displayMedia={this.handleDisplayMedia}
                    size="small"
                    badge={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderSupplierSummary(supplier) {
    return (
      <div className="shipment-info">
        <div className="customer-info">
          <Avatar
            email={supplier.emails[0].address}
            round={true}
            name={supplier.name}
            size={30}
            className="rui-order-avatar"
          />
          <strong>{supplier.name}</strong> | {supplier.emails[0].address}
        </div>
        <div className="workflow-info">
          <div className="contract-total"> {supplier.production} </div>
          <div className="contract-total"> {supplier.delivery} </div>
          <div className="contract-total"> {supplier.received} </div>
        </div>
      </div>
    );
  }

  render() {   
    const columns = [{
      Header: "",
      id: "",
      Cell: row => (
        <div className="rui card order">
          <div className="content" onClick={() => this.props.setSideViewContent(
              <AccountDetails supplier={row.original}/>
            )}>
            {this.renderSupplierSummary(row.original)}
            {this.renderProducts(row.original)}
          </div>
        </div>
      ),
      className: "contract-table-name-header"
    }];
    

    return (
      <div className="supplier-summary-container">
        {_.isEmpty(this.props.supplierSummaries) ?
        <div className='empty-view-message'> 
          There is nothing here
        </div>
        :
        <ReactTable
          data={this.props.supplierSummaries}
          columns={columns}
          defaultPageSize={10}
          className="rui order table -highlight table-header-visible"
          minRows={1}
          headerClassName="contract-table-mid-header"
          getPaginationProps={() => {
            return {
              className: "order-table-pagination-visible"
            };
          }}
          PaginationComponent={SortableTablePagination}
        />
        }
      </div>
    );
  }
}

SupplierSummaryList.propTypes = {
  supplierSummaries: PropTypes.arrayOf(PropTypes.object),
}

function composer(props, onData) {
  const mediaSub = Meteor.subscribe("Media");
  const productSub = Meteor.subscribe("Products");
  const supplierContractSub = Meteor.subscribe("SupplierTotals");

  const groupSub = Meteor.subscribe("Groups");

  var user = Accounts.findOne(Meteor.userId());


  if (productSub.ready() && supplierContractSub.ready() && mediaSub.ready()) {

    var supplierGroup = Groups.findOne({ slug: 'supplier' });
    var suppliers = Accounts.find({ groups: supplierGroup._id }).fetch();

    var supplierSummaries = suppliers.map(supplier => {
      return _.defaults( supplier, 
        SupplierTotals.findOne({ userId: supplier._id }), {
        production: 0,
        delivery: 0,
        received: 0
      });
    });

    console.dir(supplierSummaries);

    onData(null, { 
      supplierSummaries: supplierSummaries,
      ...props });
  }
}

export default composeWithTracker(composer)(SupplierSummaryList);