import { Orders, Products } from "/lib/collections/collections";
import { ContractItems } from 'imports/plugins/custom/olga-core/lib/collections/collections';

import _ from "lodash";

Orders.after.insert(function(userId, order) {
  for (let item of order.items) {
    // If the orderItem has two ancestors it is an option of a variant
    let variantId = item.variants.ancestors[1];

    let contractItem = {
      productId: item.variants._id,
      simpleId: item.productId,
      variantId: variantId || item.variants._id,
      optionId: variantId ? item.variants._id : "none",
      simpleTitle: item.title,
      variantTitle: (variantId ? item.variants.title :
        Products.findOne({'_id': item.variants._id}).title
      ),
      optionTitle: variantId ? item.variants.optionTitle : "none",
      isOption: variantId ? true : false,
      orderId: order._id,
      quantity: item.quantity,
      openQuantity: item.quantity
    };

    ContractItems.insert(contractItem);
  }
});