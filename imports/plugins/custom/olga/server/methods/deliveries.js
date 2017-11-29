import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check"; 
import { Deliveries, SupplyContracts } from "../../lib/collections";
import { Orders } from "/lib/collections";
import * as Collections from "/lib/collections";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Reaction } from "/server/api";
import { SSR } from "meteor/meteorhacks:ssr";
import { Roles } from "meteor/alanning:roles";
const bwipjs = require("bwip-js");
import UserChecks from "../../lib/userChecks";
import _ from "lodash";
import moment from "moment";

function initializeDelivery(userId, productId, quantity) {
    if(getOpenContracts(productId).length == 0) {
        return null;
    }
    var deliveryId = Deliveries.insert({
        userId: userId,
        productId: productId,
        deliveryQuantity: quantity,
        supplyContracts: [],        
    });
    return deliveryId;
}

function coverContracts(productId, quantity, deliveryId) {
    let openContracts = getOpenContracts(productId);
    let coveredContracts = [];
    let deliveryQuantity = quantity;
    let i = 0;
    while(deliveryQuantity > 0 && i < openContracts.length) {
        let openQuantity = openContracts[i].quantity - openContracts[i].sentQuantity;
        let allocatedQuantity = Math.min(openQuantity, deliveryQuantity);
        if(allocatedQuantity > 0) {
            updateSentQuantity(openContracts[i], openContracts[i].sentQuantity + allocatedQuantity);
            coveredContracts.push(openContracts[i]._id);
            deliveryQuantity -= allocatedQuantity;
        }
        i++;
    }

    return coveredContracts;
}

function updateSentQuantity(supplyContract, sentQuantity) {
    SupplyContracts.update(
        { _id: supplyContract._id },
        {
            $set: { sentQuantity: sentQuantity }
        }
    );
}

function enrichDelivery(deliveryId, coveredContracts) {
    Deliveries.update(
        { _id: deliveryId },
        {
            $set: { supplyContracts: coveredContracts }
        }
    )
}

function sendPackingListEmail(userId, deliveryId) {
    // get data for email
    let delivery = Deliveries.findOne({ _id: deliveryId });    
    let supplier = Collections.Accounts.findOne({ _id: delivery.userId });
    let product = Collections.Products.findOne({ _id: delivery.productId });
    let contracts = SupplyContracts.find({ _id: { "$in": delivery.supplyContracts } }).fetch();
    let supplyContracts = [];
    _.forEach(contracts, function(contract){
      let barcodeImg;
      bwipjs.toBuffer({
        bcid: 'code128',
        text: contract._id,
        height: 15,
        includetext: true      
      }, function (err, png) {
        if(err) {
          console.log("Kuvaa ei muodostettu");
        } else if(!png) {
          console.log("Bufferia ei ole");
        } else {
          barcodeImg = png.toString('base64');
          supplyContracts.push({
            _id: contract._id,
            remainingQuantity: contract.quantity - contract.sentQuantity,
            barcodeImg: barcodeImg
          });
        }
      });
    });
   
    const shop = Collections.Shops.findOne(supplier.shopId);
    let emailLogo;
    if (Array.isArray(shop.brandAssets)) {
      const brandAsset = shop.brandAssets.find((asset) => asset.type === "navbarBrandImage");
      const mediaId = Media.findOne(brandAsset.mediaId);
      emailLogo = path.join(Meteor.absoluteUrl(), mediaId.url());
    } else {
      emailLogo = Meteor.absoluteUrl() + "resources/email-templates/shop-logo.png";
    }

    if (!shop.emails[0].address) {
      shop.emails[0].address = "no-reply@reactioncommerce.com";
      Logger.warn("No shop email configured. Using no-reply to send mail");
    }
    if (!supplier.profile.addressBook) {
      supplier.profile.addressBook = [{
        address1: "No address given",
        address2: "",
        postal: "",
        city: ""
      }];
    }

    let data = {
      supplier: {        
        _id: supplier._id,
        name: supplier.name,
        address: supplier.profile.addressBook[0]
      },
      product: {
        _id: product._id,
        title: product.title
      },
      deliveryQuantity: delivery.deliveryQuantity,
      supplyContracts: supplyContracts,
      emailLogo: emailLogo,
      shopName: shop.name,
      legalName: shop.addressBook[0].company,
      contactEmail: shop.emails[0].address,
      physicalAddress: {
        address: shop.addressBook[0].address1 + " " + shop.addressBook[0].address2,
        city: shop.addressBook[0].city,
        postal: shop.addressBook[0].postal
      },
      copyrightDate: moment().format("YYYY"),
    }

    // get template and merge with data
    let tpl = "deliveries/packing-slip";
    let subject = "deliveries/packing-slip/subject";
    SSR.compileTemplate(tpl,  Reaction.Email.getTemplate(tpl));
    SSR.compileTemplate(subject, Reaction.Email.getSubject(tpl));

    // send email
    Reaction.Email.send({
      to: "a.a@a.com",
      from: "b.b@store.com",
      subject: SSR.render(subject, data),
      html: SSR.render(tpl, data)
    });
}

function getOpenContracts(productId) {
    return SupplyContracts.find(
        { 
            productId: productId,
            $where: function() {
                return (this.sentQuantity < this.quantity);
            }
        },
        {
            sort: { createdAt: 1 }
        }
    ).fetch();
}

export const methods = {

    "deliveries/create": function (productId, quantity) {
        check(productId, String);
        check(quantity, Number);

        let userId = Meteor.userId();
        let userChecks = new UserChecks();

        if(!Reaction.hasAdminAccess() && !userChecks.isInRole("supplier")) {
            throw new Meteor.Error(403, "Access Denied");
        }

        let deliveryId = initializeDelivery(userId, productId, quantity);
        if(!deliveryId) {
            return null;
        }
        let coveredContracts = coverContracts(productId, quantity, deliveryId);
        enrichDelivery(deliveryId, coveredContracts);
        sendPackingListEmail(userId, deliveryId);
        
        return deliveryId;
    }

}

Meteor.methods(methods);