import { Session } from "meteor/session";
import _ from "lodash";
import { Template } from "meteor/templating";
import { Products } from "/lib/collections";

Template.supplierProductsList.onCreated(function () {   
    this.products = ReactiveVar();
    // subscribe to products
    this.autorun(() => {
    //const scrollLimit = Session.get("productScrollLimit");

    //const queryParams = {};
    this.subscribe("Products");

    const products = Products.find(
      {},
      { sort: {
        createdAt: 1
      }});
    this.products.set(products.fetch());
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
    }
 });