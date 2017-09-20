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
  ancestors: function (product) {
    if (product.ancestors && product.ancestors.length > 0) {
      const ancestorArray = [];
      product.ancestors.forEach(function (ancestorId) {
        const ancestor = _.find(
          Template.instance().products.get(),
          { _id: ancestorId });
        ancestorArray.push(ancestor);
      });
      return ancestorArray;
    }
    return false;
  },
  productOrderCount(productId) {
    const orderArray = _.filter(
      Template.instance().orders.get(),
      function (o) {
        if (_.some(o.items, { productId: productId })) {return o;}
      }
    );
    return orderArray.length;
  },
  productOrderQuantity() {
    return 0;
  },
  productOpenOrderQuantity() {
    return 0;
  }
});
