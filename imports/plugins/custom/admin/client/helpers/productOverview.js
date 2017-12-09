import _ from 'lodash';

import { Products } from "/lib/collections";
import { OpenSimpleTotals, OpenVariantOptionTotals,
         SimpleContractTotals, VariantContractTotals } from 'imports/plugins/custom/olga-core/lib/collections/collections';


export function getProductVariants(productId) {
  return Products.find({
    $and: [{ ancestors: { $size: 1 } }, { ancestors: productId } ]
  }).fetch();
}

export function getVariantOptions(variantId) {
  return Products.find({
    $and: [{ ancestors: { $size: 2 } }, { ancestors: variantId} ]
  }).fetch();
}

export function getProductSummary(product) {
  return _.defaults(
    _.merge(
      product,
      OpenSimpleTotals.findOne({simpleId: product._id}),
      SimpleContractTotals.findOne({simpleId: product._id})
    ), {
      simpleTitle: product.title,
      simpleId: product._id,
      openQuantity: 0,
      production: 0,
      delivery: 0,
      received: 0
    }
  );
}

export function getVariantSummary(variant, option = false) {
  let productId = option ? option._id : variant._id;
  let title = variant.title + (option ? ' - ' + option.optionTitle : '')

  return _.defaults(
    _.merge(
      OpenVariantOptionTotals.findOne({productId: productId}),
      VariantContractTotals.findOne({productIs: productId})
    ), {
      variantTitle: variant.title,
      optionTitle: option.optionTitle,
      title: title,
      isOption: option ? true : false,
      openQuantity: 0,
      production: 0,
      delivery: 0,
      received: 0
    }
  );
}