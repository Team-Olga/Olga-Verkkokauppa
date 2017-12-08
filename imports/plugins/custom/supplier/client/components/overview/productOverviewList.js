import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import ReactTable from "react-table";
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';
import { SortableTablePagination } from "/imports/plugins/custom/ui/client/components/table/sortableTableComponents";
import Avatar from "react-avatar";
import './styles.less';

import { Products, Accounts } from "/lib/collections";
import { ContractItems, OpenSimpleTotals, OpenVariantOptionTotals,
         SimpleContractTotals, VariantContractTotals } from 'imports/plugins/custom/olga-core/lib/collections/collections';

import { getProductVariants, getVariantOptions, 
         getProductSummary, getVariantSummary } from '../../helpers/productOverview';

class ProductOverviewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: {},
    };
  }

  render() {   
    const simpleTitleColumn = {
      Header: "Tuote",
      id: "simpleTitle",
      Cell: info => (
        <span className="product-name"> {info.original.simpleTitle} </span>
      ),
      className: "contract-table-name-header"
    };

    const quantityColumns = [
      {
        Header: "Avoinna",
        id: "openQuantity",
        Cell: info => (
          <div className={"open-total" + (info.original.openQuantity ? "" : "-zero")}
          onClick={() => this.props.setSideViewContent(
              <div> I AM OPEN </div> 
            )}> 
            {info.original.openQuantity} 
          </div>
        ),
      }, {
        Header: "Tuotannossa",
        id: "production",
        Cell: info => (
          <div className="contract-total"> {info.original.production} </div>
        ),
      }, {
        Header: "Lähetyksiä",
        id: "delivery",
        Cell: info => (
          <div className="contract-total"> {info.original.delivery} </div>
        ),
      }, {
        Header: "Vastaanotettu",
        id: "received",
        Cell: info => (
          <div className="contract-total"> {info.original.received} </div>
        ),
      }
    ];

    const quantityColDefaults = {
      maxWidth: 120,
      className: "contract-table-mid-header" 
    };

    const variantTitleColumn = {
      Header: "",
      id: "variantOptionTitle",
      accessor: d => d.title,
      Cell: row => (
        <span className="variant-option-name">
          {row.original.title}
        </span>
      ),
    };

    const simpleColumns = quantityColumns.map(
      col => _.defaults(col, quantityColDefaults)
    );

    const variantColumns = quantityColumns.map(
      col => _.assign({}, col, {"Header": ""})
    );

    simpleColumns.unshift(simpleTitleColumn);
    variantColumns.unshift(variantTitleColumn);

    return (
      <div className="product-summary-container">
        {_.isEmpty(this.props.productOverviews) ?
        <div className='empty-view-message'> 
          There is nothing here
        </div>
        :
        <ReactTable
          data={this.props.productOverviews}
          columns={simpleColumns}
          defaultPageSize={10}
          className="rui order table -highlight table-header-visible"
          minRows={1}
          expanded={this.state.expanded}
          onExpandedChange={expanded => this.setState({ expanded })}
          headerClassName="contract-table-mid-header"
          getPaginationProps={() => {
            return {
              className: "order-table-pagination-visible"
            };
          }}
          PaginationComponent={SortableTablePagination}

          SubComponent={row => {
            var variantOptions = [];
            const variants = getProductVariants(row.original.simpleId);

            for (let variant of variants) {
              const options = getVariantOptions(variant._id);

              if (_.isEmpty(options)) {
                variantOptions.push(getVariantSummary(variant));
                continue;
              }

              for (let option of options) {
                variantOptions.push(getVariantSummary(variant, option));
              }
            }

            if (this.props.filterOpen) {
              variantOptions = variantOptions.filter(p => p.openQuantity > 0)
            }

            return (
             <VelocityTransitionGroup
                enter={{animation: "slideDown", delay:10, duration: 400, easing: "ease-in-out"}}
                leave={{animation: "slideUp", duration: 600, easing: "ease-in-out"}}
                runOnMount={true}
              >
                {this.state.expanded[row.index] !== false ? 
                <div className="variant-table-container">
                  <ReactTable
                    data={variantOptions}
                    columns={variantColumns}
                    className="rui order table supplier-table -highlight "
                    headerClassName="contract-table-mid-header"
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

ProductOverviewList.propTypes = {
  productOverviews: PropTypes.arrayOf(PropTypes.object),
}

function composer(props, onData) {
  const productSub = Meteor.subscribe("Products");
  const simpleOpenSub = Meteor.subscribe("OpenSimpleTotals");
  const variantOpenSub = Meteor.subscribe("OpenVariantOptionTotals");

  const simpleContractSub = Meteor.subscribe("SimpleContractTotals");
  const variantContractSub = Meteor.subscribe("VariantContractTotals");

  var user = Accounts.findOne(Meteor.userId());


  if (productSub.ready() && simpleOpenSub.ready() && variantOpenSub.ready() &&
      simpleContractSub.ready() && variantContractSub.ready()) {
    
    var supplierProducts = user.products.filter(
      p => p.title.toLowerCase().includes(props.searchQuery.toLowerCase())
    )

    var productOverviews = supplierProducts.map(product => {
      return getProductSummary(product);
    });

    if (props.filterOpen) {
      productOverviews = productOverviews.filter(p => p.openQuantity > 0)
    }

    onData(null, { 
      productOverviews: productOverviews,
      ...props });
  }
}

export default composeWithTracker(composer)(ProductOverviewList);