import _ from 'lodash';

import { Products } from "/lib/collections";
import { SupplierTotals } from 'imports/plugins/custom/olga-core/lib/collections/collections';


export function getSupplierTotals(supplier) {
  return _.defaults(
    _.merge(
      SupplierTotals.findOne({userId: supplier._id}),
    ), {
      production: 0,
      delivery: 0,
      received: 0
    }
  );
}