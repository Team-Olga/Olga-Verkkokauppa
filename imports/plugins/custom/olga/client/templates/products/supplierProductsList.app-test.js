import { Meteor } from "meteor/meteor";
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

import { withRenderedTemplate } from "../test-helpers";

import "./supplierProductsList.html";
import "./supplierProductsList";

var testProducts;
var testOrders;

describe("SupplierProductsList", function (done) {

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
        withRenderedTemplate("supplierProductsList", {products: testProducts}, el => {
            var listings = $(el).find(".productlisting");
            chai.assert.equal(testProducts.length, listings.length, "wrong number of product listings");
            _.forEach(testProducts, function(product) {
                let found = false;
                listings.each(function() {
                    if($(this).find(".listingtitle").text() === product.title) {
                        found = true;
                    }
                });
                chai.assert.isTrue(found, "couldn't find " + product.title);
            });
            
        });
        done();
    });
});