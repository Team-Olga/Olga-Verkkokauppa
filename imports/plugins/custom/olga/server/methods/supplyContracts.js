import { Meteor } from "meteor/meteor";
import { SupplyContracts } from "../../collections";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const createSupplyContract = new ValidatedMethod({
    name: "supplyContracts.create",
    validate: new SimpleSchema({
        userId: { type: String },
        productId: { type: String },
        quantity: { type: Number }
    }).validator(),
    run({ userId, productId, quantity }) {
        // tähän ensin haku, joka etsii aikajärjestyksessä ensimmäisen
        // tilauksen, jossa on tuotteita odottamassa toimituslupauksia;
        // jos sellaista ei ole, heitettävä virhe;
        // jos ensimmäisen tilauksen avoin tilausmäärä ei riitä 
        // parameterina annettuun quantityyn, etsitään seuraavia
        // niin kauan kunnes toimituslupaus täyttyy;
        // jos pystytään kattamaan vain osittain, pitää jotenkin
        // saada clientille ilmoitus tästä
        SupplyContracts.insert({
            userId: userId,
            productId: productId,
            quantity: quantity
        });
    }    
});

export const deleteSupplyContract = new ValidatedMethod({
    name: "supplyContracts.delete",
    validate: new SimpleSchema({
        supplyContractId: { type: String }
    }).validator(),
    run({ supplyContractId }) {
        SupplyContracts.remove(supplyContractId);
    }
});

Meteor.methods({
    [createSupplyContract.name]: function (args) {
        createSupplyContract.validate.call(this, args);
        createSupplyContract.run.call(this, args);
    },
},
{
    [deleteSupplyContract.name]: function(args) {
        deleteSupplyContract.validate.call(this.args);
        deleteSupplyContract.run.call(this, args);
    }
})