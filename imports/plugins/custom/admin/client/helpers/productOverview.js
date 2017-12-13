import _ from 'lodash';

import { Products } from "/lib/collections";
import { SimpleOpenTotals, VariantOpenTotals,
         SimpleContractTotals, VariantContractTotals } from '@olga/olga-collections';


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
      SimpleOpenTotals.findOne({simpleId: product._id}),
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
      VariantOpenTotals.findOne({productId: productId}),
      VariantContractTotals.findOne({productId: productId})
    ), {
      variantTitle: variant.title,
      optionTitle: option.optionTitle,
      productId: productId,
      title: title,
      isOption: option ? true : false,
      isVariant: true,
      openQuantity: 0,
      production: 0,
      delivery: 0,
      received: 0
    }
  );
}