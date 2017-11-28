import { Deliveries, SupplyContracts } from "../../lib/collections";
import * as Collections from "/lib/collections";
import { SSR } from "meteor/meteorhacks:ssr";
import { Reaction } from "/server/api";
import _ from "lodash";

Deliveries.after.insert(function(userId, delivery) {
    // get data for email
    let supplier = Collections.Accounts.findOne({ _id: delivery.userId });
    let product = Collections.Products.findOne({ _id: delivery.productId });
    let contracts = SupplyContracts.find({ _id: { "$in": delivery.supplyContracts } }).fetch();
    let supplyContracts = [];
    _.forEach(contracts, function(contract){
      supplyContracts.push({
        _id: contract._id,
        remainingQuantity: contract.quantity - contract.sentQuantity
      });
    })

    let data = {
      supplier: {        
        _id: supplier._id,
        name: supplier.name
      },
      product: {
        _id: product._id,
        title: product.title
      },
      deliveryQuantity: delivery.deliveryQuantity,
      supplyContracts: supplyContracts
    }

    // get template and merge with data
    let tpl = "deliveries/packing-slip";
    let subject = "deliveries/packing-slip/subject";
    SSR.compileTemplate(tpl,  Reaction.Email.getTemplate(tpl));
    SSR.compileTemplate(subject, Reaction.Email.getTemplate(tpl));

    // send email
    Reaction.Email.send({
      to: "a.a@a.com",
      from: "b.b@store.com",
      subject: SSR.render(subject, data),
      html: SSR.render(tpl, data)
    });

});