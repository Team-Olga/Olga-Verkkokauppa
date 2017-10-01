import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Tracker } from "meteor/tracker";
import { DDP } from "meteor/ddp-client";
import { Promise } from "meteor/promise";
import { chai } from "meteor/practicalmeteor:chai";
import faker from "faker";
import { Factory } from "meteor/dburles:factory";
import { Random } from "meteor/random";
import StubCollections from "meteor/hwillson:stub-collections";
import { sinon } from "meteor/practicalmeteor:sinon";
import { $ } from 'meteor/jquery';
import { Template } from "meteor/templating";
import { Products, Orders } from "/lib/collections";
import ReactTestUtils from "react-addons-test-utils";

import SupplierProductsContainer from "../../containers/products/supplierProductsContainer";

var testProducts;
var testOrders;

describe("SupplierProductsReact", function (done) {

    beforeEach(function () {
        StubCollections.stub([Products, Orders]);
        Template.registerHelper('_', key => key);
        sinon.stub(Meteor, 'subscribe', () => ({
            subscriptionId: 0,
            ready: () => true,
        }));

        Factory.define('product', Products, {
            _id: Random.id(),
            title: "TestProduct",
            ancestors: [],
            createdAt: Date.now(),

        });

        Factory.define('order', Orders, {
            _id: Random.id(),
            items: [
                {variants: 
                    {_id:  Random.id()}
                }
            ],
            createdAt: Date.now()
        });

        testProducts = [];
        testOrders = [];

        _.times(3, function (index) {
            let product = Factory.create('product', {
                _id: Random.id(),
                title: "Test " + index,
            });
            testProducts.push(product);
        });

        let items0 = [{
            quantity: 3,
            variants: {_id: testProducts[0]._id}
        }];

        let items1 = [
            {
                quantity: 7,
                variants: {_id: testProducts[1]._id}
            },
            {
                quantity: 4,
                variants: {_id: testProducts[0]._id}
            },
        ];

        let order0 = Factory.create('order', {
                _id: Random.id(),
                items: items0
            });
        testOrders.push(order0);

        let order1 = Factory.create('order', {
                _id: Random.id(),
                items: items1
            });
        testOrders.push(order1);
    });

    afterEach(function () {
        StubCollections.restore();
        Template.deregisterHelper('_');
        Meteor.subscribe.restore();
    });

    it("renders all products", function (done) {
        var component = ReactTestUtils.renderIntoDocument(
            <SupplierProductsContainer />
        );
        var productRows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "supplier-product-row");
        
        chai.assert.equal(productRows.length, testProducts.length, "wrong number of product listings");
        _.forEach(testProducts, function(product) {
            let found = false;
            _.forEach(productRows, function(row) {                
                if($(row).find(".listingtitle").text() === product.title) {
                    found = true;
                }                
            });
            chai.assert.isTrue(found, "couldn't find " + product.title);
        });

        done();
    });

    it("shows correct statistics for each product", function(done) {
        // withRenderedTemplate("supplierProductsReact", {products: testProducts}, el => {
        //     $(el).find(".productlisting").each(function() {
        //         let title = $(this).find(".listingtitle").text();
        //         $(this).find(".btn-listing").each(function() {
        //             let btnText = $(this).text().split(" ");   
        //             chai.assert.equal(btnText[1], getProductStats(title, btnText[0]), "Stat " + btnText[0] + " wrong for product " + title);
        //         });
        //     });            
        // });
        var component = ReactTestUtils.renderIntoDocument(
            <SupplierProductsContainer />
        );
        var productRows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "supplier-product-row");

        _.forEach(productRows, function(row) {
            let title = $(row).find(".listingtitle").text();
            console.log("Prodcut: " + title);
            $(row).find(".listing-button").each(function() {
                console.log("Button: " + $(this).text());
                let btnText = $(this).text().split(" ");   
                console.log("")
                chai.assert.equal(btnText[1], getProductStats(title, btnText[0]), "Stat " + btnText[0] + " wrong for product " + title);
            })
        });

        chai.assert.equal(1, 1);
        done();
    });
});

function getProductStats(title, stat) {
    let productId = _.find(testProducts, function(p) {
        if(p.title === title)
            return true;
    })._id;
    let orderCount = 0;
    let orderedQuantity = 0;    
    let openOrderCount = 0;

    _.forEach(testOrders, function(o) {
        _.forEach(o.items, function(item) {
            if(item.variants._id === productId) {
                orderCount++;
                orderedQuantity += item.quantity;
            }
        });
    });

    switch (stat) {
        case "Avoinna":
            return openOrderCount;
        case "Tilauksia":
            return orderCount;
        case "Tilattu":
            return orderedQuantity;
    }
}