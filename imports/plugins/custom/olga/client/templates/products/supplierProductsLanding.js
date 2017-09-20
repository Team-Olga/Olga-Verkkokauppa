import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { Products } from "/lib/collections";
import { ReactiveVar } from "meteor/reactive-var";
import { ReactiveDict } from "meteor/reactive-dict";

// create reactive variable and dictionary to store product list and
// user/session-related values
Template.supplierProductsLanding.onCreated(function () {
  this.products = ReactiveVar();
  this.state = new ReactiveDict();
  this.state.setDefault({

  });

  // subscribe to products
  this.autorun(() => {
    const scrollLimit = Session.get("productScrollLimit");

    const queryParams = {};
    this.subscribe("Products", scrollLimit, queryParams);

    const products = Products.find(
      {},
      { sort: {
        createdAt: 1
      } });
    this.products.set(products.fetch());
  });
});

Template.supplierProductsLanding.helpers({
  products() {
    return Template.instance().products.get();
  },
  ready() {
    const instance = Template.instance();
    const isReady = instance.subscriptionsReady();

    if (isReady) {
      return true;
    }
    return false;
  }
});

Template.supplierProductsLanding.events({

});
