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

import { Products, Accounts, Media } from "/lib/collections";
import { ContractItems, OpenSimpleTotals, OpenVariantOptionTotals,
         SimpleContractTotals, VariantContractTotals, ProductSettings  } from 'imports/plugins/custom/olga-core/lib/collections/collections';

import { getProductVariants, getVariantOptions, 
         getProductSummary, getVariantSummary } from '../../helpers/productOverview';

import ProductDetails from "./productDetails";

class ProductSummaryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: {},
    };
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

  render() {   
    const simpleTitleColumn = {
      Header: "Tuote",
      id: "simpleTitle",
      Cell: row => (
        <div>
          <div className="product-name"> {row.original.simpleTitle} </div>
          <div className="product-settings" 
            onClick={() => this.props.setSideViewContent(
              <ProductDetails 
                product={_.defaults(
                  row.original, 
                  ProductSettings.findOne({ productId: row.original.simpleId })
                )} 
                displayMedia={this.handleDisplayMedia}
              />
            )}>
            <i className="fa fa-cog"></i>
          </div>
        </div>
      ),
      className: "contract-table-name-header"
    };

    const quantityColumns = [
      {
        Header: "Avoinna",
        id: "openQuantity",
        Cell: row => (
          <div className={"open-total" + (row.original.openQuantity ? "" : "-zero")}> 
            {row.original.openQuantity} 
          </div>
        ),
      }, {
        Header: "Tuotannossa",
        id: "production",
        Cell: row => (
          <div className="contract-total"> {row.original.production} </div>
        ),
      }, {
        Header: "Lähetyksiä",
        id: "delivery",
        Cell: row => (
          <div className="contract-total"> {row.original.delivery} </div>
        ),
      }, {
        Header: "Vastaanotettu",
        id: "received",
        Cell: row => (
          <div className="contract-total"> {row.original.received} </div>
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
  const mediaSub = Meteor.subscribe("Media");
  const productSub = Meteor.subscribe("Products");
  const productSettingsSub = Meteor.subscribe("ProductSettings");

  const simpleOpenSub = Meteor.subscribe("OpenSimpleTotals");
  const variantOpenSub = Meteor.subscribe("OpenVariantOptionTotals");

  const simpleContractSub = Meteor.subscribe("SimpleContractTotals");
  const variantContractSub = Meteor.subscribe("VariantContractTotals");


  if (productSub.ready() && simpleOpenSub.ready() && variantOpenSub.ready() &&
      simpleContractSub.ready() && variantContractSub.ready() && mediaSub.ready()) {
    
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