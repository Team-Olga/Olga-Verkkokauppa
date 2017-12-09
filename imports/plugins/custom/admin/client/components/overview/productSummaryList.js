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

class ProductSummaryList extends Component {
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
          <div className={info.original.isVariant ? "open-total" + (info.original.openQuantity ? "" : "-zero"): "contract-info"}> 
            {info.original.openQuantity} 
          </div>
        ),
      }, {
        Header: "Tuotannossa",
        id: "production",
        Cell: info => (
          <div className={info.original.isVariant ? (info.original.production > 0 ? "contract-total": "open-total-zero") : "contract-info"}> 
            {info.original.production}
          </div>
        ),
      }, {
        Header: "Lähetyksiä",
        id: "delivery",
        Cell: info => (
          <div className={info.original.isVariant ? (info.original.received > 0 ? "contract-total": "open-total-zero") : "contract-info"}> 
            {info.original.delivery} 
          </div>
        ),
      }, {
        Header: "Vastaanotettu",
        id: "received",
        Cell: info => (
          <div className="contract-info"> {info.original.received} </div>
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
        {_.isEmpty(this.props.productSummaries) ?
        <div className='empty-view-message'> 
          There is nothing here
        </div>
        :
        <ReactTable
          data={this.props.productSummaries}
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
            var variantoptionSummaries = [];
            const variants = getProductVariants(row.original.simpleId);

            for (let variant of variants) {
              const options = getVariantOptions(variant._id);

              if (_.isEmpty(options)) {
                variantoptionSummaries.push(getVariantSummary(variant));
                continue;
              }

              for (let option of options) {
                variantoptionSummaries.push(getVariantSummary(variant, option));
              }
            }

            if (this.props.filterOpen) {
              variantoptionSummaries = variantoptionSummaries.filter(p => p.openQuantity > 0)
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
                    data={variantoptionSummaries}
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

ProductSummaryList.propTypes = {
  productSummaries: PropTypes.arrayOf(PropTypes.object),
}

function composer(props, onData) {
  const productSub = Meteor.subscribe("Products");
  const simpleOpenSub = Meteor.subscribe("OpenSimpleTotals");
  const variantOpenSub = Meteor.subscribe("OpenVariantOptionTotals");

  const simpleContractSub = Meteor.subscribe("SimpleContractTotals");
  const variantContractSub = Meteor.subscribe("VariantContractTotals");


  if (productSub.ready() && simpleOpenSub.ready() && variantOpenSub.ready() &&
      simpleContractSub.ready() && variantContractSub.ready()) {
    
    var products = Products.find({ type: 'simple' }).fetch();

    var filteredProducts = products.filter(
      p => p.title.toLowerCase().includes(props.searchQuery.toLowerCase())
    )

    var productSummaries = filteredProducts.map(product => {
      return getProductSummary(product);
    });

    if (props.filterOpen) {
      productSummaries = productSummaries.filter(p => p.openQuantity > 0)
    }

    onData(null, { 
      productSummaries: productSummaries,
      ...props });
  }
}

export default composeWithTracker(composer)(ProductSummaryList);