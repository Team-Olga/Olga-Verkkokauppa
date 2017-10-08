import _ from "lodash";
import { Template } from "meteor/templating";
import { Products, Orders } from "/lib/collections";
import { ReactiveVar } from "meteor/reactive-var";

Template.supplierProductsList.onCreated(function () {
  this.products = ReactiveVar();
  this.orders = ReactiveVar();

  this.autorun(() => {
    this.subscribe("Products");
    this.subscribe("Orders");

    const products = Products.find(
      {},
      { sort: { createdAt: 1 } }
    );
    const orders = Orders.find(
      {},
      { sort: { createdAt: 1 } }
    );
    this.products.set(products.fetch());
    this.orders.set(orders.fetch());
  });
});

Template.supplierProductsList.helpers({
    // returns all ancestor products of the given product
    ancestors(product) {
        if(product.ancestors && product.ancestors.length > 0) {
            let ancestorArray = [];
            product.ancestors.forEach(function(ancestorId) {
                let ancestor = _.find(
                    Template.instance().products.get(), 
                    { '_id': ancestorId });
                ancestorArray.push(ancestor);
            });
            return ancestorArray;
        }
        return false;
    },
    productOrderCount(productId) {
        let orderArray = _.filter(
            Template.instance().orders.get(),
            function(o) {
                let match = false;
                _.forEach(o.items, function(item) {
                    if(item.variants._id == productId) {
                        match = true;
                    }
                });
               return match;
            }
        )
        return orderArray.length;
    },
    productOrderQuantity(productId) {
        let count = 0;
        _.forEach(
            Template.instance().orders.get(),
            function(o) {
                _.forEach(o.items, function(item) {
                    if(item.variants._id == productId) {
                        count += item.quantity;
                    }
                });
            }
        )
        return count;
    },
    productOpenOrderQuantity(productId) {
        return 0;
  }
});
