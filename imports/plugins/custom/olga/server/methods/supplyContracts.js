// import { Meteor } from "meteor/meteor";
// import { check, Match } from "meteor/check"; 
// import { SupplyContracts } from "../../lib/collections";
// import { Orders } from "/lib/collections";
// import { ValidatedMethod } from "meteor/mdg:validated-method";
// import { SimpleSchema } from "meteor/aldeed:simple-schema";
// import { Reaction } from "/server/api";
// import { Roles } from "meteor/alanning:roles";
// import UserChecks from "../helpers/userChecks";
// import _ from "lodash";

// // TODO: siivoa pois turhat date-jutut
// function initializeContract(userId, productId, quantity) {
//     if(!hasOpenOrders(productId)) {
//         return null;
//     }
//     let createdAt = new Date;
//     var supplyContractId = SupplyContracts.insert({
//         userId: userId,
//         productId: productId,
//         quantity: quantity,
//         orders: [],
//         sentQuantity: 0,
//         receivedQuantity: 0,
//         // createdAt: createdAt
//     });
//     return supplyContractId;
// }

// // TODO: tää ei nyt palauta pelkästään ordereita joissa on avointa saldoa vaan tuotteen kaikki tilaukset...
// // refaktoroinnin jälkeen voi hyödyntää tätä avointen haussa
// function hasOpenOrders(productId) {
//     let openOrders = Orders.find({ "productSupplies.productId": productId }).fetch();
//     return openOrders.length > 0;
// }

// // TODO: refaktoroi
// function coverOrders(productId, quantity, supplyContractId) {
//     let openOrders = Orders.find({}, { sort: { createdAt: 1 }}).fetch();
//     // filters those orders where product matches and at least part of the
//     // quantity ordered is not matched by other supply contracts
//     openOrders = _.filter(
//         openOrders,
//         function(o) {
//             let match = false;            
//             _.forEach(o.productSupplies, function(productSupply) {
//                 if(productSupply.productId == productId
//                     && productSupply.openQuantity > 0
//                     ) {
//                     match = true;
//                 }
//             });
//             return match;
//         });

//     // loops through open orders (assumed to be in ascending chronological order)
//     // and "spends" contractQuantity on each of them in turn until contractQuantity == 0
//     let coveredOrders = [];
//     let contractQuantity = quantity;
//     let i = 0;
//     while(contractQuantity > 0 && i < openOrders.length) {
//         let openQuantity = getOpenQuantity(openOrders[i], productId);
//         let supplyQuantity = openQuantity < contractQuantity ? openQuantity : contractQuantity;
//         if(supplyQuantity > 0) {
//             updateOpenQuantity(openOrders[i], productId, supplyQuantity, supplyContractId);
//             coveredOrders.push(openOrders[i]._id);
//             contractQuantity = contractQuantity - supplyQuantity;
//         }
//         i++;
//     }
//     return coveredOrders;
// }

// function enrichContract(supplyContractId, coveredOrders) {
//     SupplyContracts.update(
//         { _id: supplyContractId },
//         { $set: {
//             orders: coveredOrders    
//         }}
//     );
// }

// function getOpenQuantity(order, productId) {
//     let openQuantity = 0;
//     _.forEach(order.productSupplies, function(productSupply) {
//         if(productSupply.productId === productId) {
//             openQuantity = productSupply.openQuantity;
//         }
//     });   
//     return openQuantity; 
// }

// function updateOpenQuantity(order, productId, supplyQuantity, supplyContractId) {
//     let newSupplies = order.productSupplies;
//     _.forEach(newSupplies, function(productSupply) {
//         if(productSupply.productId == productId) {
//             productSupply.openQuantity = productSupply.openQuantity - supplyQuantity;
//             productSupply.supplyContracts.push(supplyContractId);
//             return false;
//         }
//     });
//     Orders.update(
//         { _id: order._id },
//         { $set: {
//             productSupplies: newSupplies
//         }});
// }

// export const methods = {

//     "supplyContracts/create": function (productId, quantity) {
//         // const validQuantity = Match.Where((x) => {
//         //   console.log("Validoidaan luku " + x);
//         //   console.log("Positive: " + x > 0);
//         //   check(x, Number);
//         //   return x > 0;
//         // })
//         console.log("SupplyContracts/create " + productId + quantity);
//         check(productId, String);
//         check(quantity, Match.Where((x) => {
//           console.log("Validoidaan luku " + x);
//           console.log("Positive: " + x > 0);
//           check(x, Number);
//           return x > 0;
//         }));

//         let userId = Meteor.userId();
//         let userChecks = new UserChecks();
        
//         if(!Reaction.hasAdminAccess() && !userChecks.isInRole("supplier")) {
//             throw new Meteor.Error(403, "Access Denied");
//         }

//         let supplyContractId = initializeContract(userId, productId, quantity);
//         if(!supplyContractId) {
//             return null;
//         }
//         let coveredOrders = coverOrders(productId, quantity, supplyContractId);
//         enrichContract(supplyContractId, coveredOrders);

//         return supplyContractId;
//     },

//     "supplyContracts/delete": function (supplyContractId) {
//         check(supplyContractId, String);

//         if(!Reaction.hasAdminAccess()) {
//             throw new Meteor.Error(403, "Access Denied");
//         }

//         SupplyContracts.remove(supplyContractId);
//     }
// };

// //Meteor.methods(methods);