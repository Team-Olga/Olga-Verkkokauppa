import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { Tracker } from "meteor/tracker";
import { DDP } from "meteor/ddp-client";
import { Promise } from "meteor/promise";
import { chai } from "meteor/practicalmeteor:chai";
import { mount, ReactWrapper } from "enzyme";
import faker from "faker";
import { Factory } from "meteor/dburles:factory";
import { Random } from "meteor/random";
import StubCollections from "meteor/hwillson:stub-collections";
import { sinon } from "meteor/practicalmeteor:sinon";
import { $ } from 'meteor/jquery';
import { Template } from "meteor/templating";
import Modal from 'react-modal';
import { Products, Orders, Accounts } from "/lib/collections";
import { SupplyContracts } from "../../../lib/collections";
import UserChecks from "../../../lib/userChecks";
import { Roles } from "meteor/alanning:roles";
import ReactTestUtils from "react-addons-test-utils";

import SupplierProductsContainer from "../../containers/products/supplierProductsContainer";

var testProducts;
var testOrders;
var testContracts;
var testAccounts;
var sandbox;

describe("SupplierProductsReact", function (done) {

    beforeEach(function () {
        StubCollections.stub([Products, Orders, Accounts, SupplyContracts]);
        sandbox = sinon.sandbox.create();
        Template.registerHelper('_', key => key);
        sandbox.stub(Meteor, 'subscribe', () => ({
            subscriptionId: 0,
            ready: () => true,
        }));
        sandbox.stub(Roles, "userIsInRole", () => true);
        sandbox.stub(UserChecks.prototype, "isInRole", () => true);
        sandbox.stub(Meteor, "userId", () => Random.id());
        sandbox.stub(Meteor, "user", () => { roles: { J8Bhq3uTtdgwZx3rz: [ "supplierproducts", "admin" ]}});

        Factory.define('product', Products, {
            _id: Random.id(),
            title: "TestProduct",
            ancestors: [],
            type: "simple",
            isVisible: false,
            isDeleted: true,
            createdAt: Date.now(),
        });

        Factory.define('order', Orders, {
            _id: Random.id(),
            items: [
                { 
                    variants: 
                        { _id:  Random.id() },
                    quantity: 0
                }
            ],
            productSupplies: [],
            createdAt: Date.now()
        });

        Factory.define('contract', SupplyContracts, {
            _id: Random.id(),
            userId: Random.id(),
            orders: [],
            productId: Random.id(),
            quantity: 0,
            sentQuantity: 0,
            receivedQuantity: 0,
            createdAt: Date.now()
        });

        Factory.define('account', Accounts, {
            _id: Random.id(),
            products: []
        });

        testProducts = [];
        testOrders = [];
        testContracts = [];
        testAccounts = [];

        let product = Factory.create('product', {
            _id: Random.id(),
            title: "Parent",
            ancestors: [],
            type: "simple",
            isVisible: true,
            isDeleted: false,
            createdAt: Date.now(),
        });
        testProducts.push(product);

        product = Factory.create('product', {
            _id: Random.id(),
            title: "ParentHidden",
            ancestors: [ testProducts[0]._id ],
            type: "variant",
            isVisible: false,
            isDeleted: false,
            createdAt: Date.now(),
        });
        testProducts.push(product);

        product = Factory.create('product', {
            _id: Random.id(),
            title: "TestDeleted",
            ancestors: [ testProducts[0]._id ],
            type: "variant",
            isVisible: true,
            isDeleted: true,
            createdAt: Date.now(),
        });
        testProducts.push(product);

        product = Factory.create('product', {
            _id: Random.id(),
            title: "Test0",
            ancestors: [ testProducts[0]._id, testProducts[1]._id ],
            type: "variant",
            isVisible: true,
            isDeleted: false,
            createdAt: Date.now(),
        });
        testProducts.push(product);

        product = Factory.create('product', {
            _id: Random.id(),
            title: "Test1",
            ancestors: [ testProducts[0]._id, testProducts[1]._id ],
            type: "variant",
            isVisible: true,
            isDeleted: false,
            createdAt: Date.now(),
        });
        testProducts.push(product);

        product = Factory.create('product', {
            _id: Random.id(),
            title: "Test2",
            ancestors: [ testProducts[0]._id, testProducts[1]._id ],
            type: "variant",
            isVisible: true,
            isDeleted: false,
            createdAt: Date.now(),
        });
        testProducts.push(product);

        let items0 = [{
            quantity: 3,
            variants: {_id: testProducts[3]._id}
        }];

        let items1 = [
            {
                quantity: 7,
                variants: {_id: testProducts[4]._id}
            },
            {
                quantity: 4,
                variants: {_id: testProducts[3]._id}
            },
        ];

        let productSupplies0 = [
            {
                productId: testProducts[3]._id,
                supplyContracts: [],
                openQuantity: 1
            }
        ];

        let productSupplies1 = [
            {
                productId: testProducts[4]._id,
                supplyContracts: [],
                openQuantity: 6
            },
            {
                productId: testProducts[3]._id,
                supplyContracts: [],
                openQuantity: 4
            }
        ];

        let order0 = Factory.create('order', {
                _id: Random.id(),
                items: items0,
                productSupplies: productSupplies0
            });
        testOrders.push(order0);

        let order1 = Factory.create('order', {
                _id: Random.id(),
                items: items1,
                productSupplies: productSupplies1
            });
        testOrders.push(order1);

        let contract0 = Factory.create('contract', {
                _id: Random.id(),
                userId: Random.id(),
                orders: [],
                productId: testProducts[3]._id,
                quantity: 1,
                sentQuantity: 0,
                receivedQuantity: 0,
                createdAt: Date.now()
        });
        testContracts.push(contract0);

        let contract1 = Factory.create('contract', {
                _id: Random.id(),
                userId: Random.id(),
                orders: [],
                productId: testProducts[4]._id,
                quantity: 1,
                sentQuantity: 0,
                receivedQuantity: 0,
                createdAt: Date.now()
        });
        testContracts.push(contract1);

        let contract2 = Factory.create('contract', {
                _id: Random.id(),
                userId: Random.id(),
                orders: [],
                productId: testProducts[3]._id,
                quantity: 1,
                sentQuantity: 1,
                receivedQuantity: 0,
                createdAt: Date.now()
        });
        testContracts.push(contract2);

        let account0 = Factory.create('account', {
            _id: Random.id(),
            products: [ testProducts[0]._id ]
        })

    });

    afterEach(function () {
        StubCollections.restore();
        Template.deregisterHelper('_');
        sandbox.restore();
    });

    it("renders all products", function (done) {
        var component = ReactTestUtils.renderIntoDocument(
            <SupplierProductsContainer />
        );
        var productRows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "rt-tr-group");
        
        chai.assert.equal(productRows.length, 3, "wrong number of product listings");
        _.forEach(testProducts, function(product) {
            let found = false;
            if(product.type === "variant" && product.isVisible === true && product.isDeleted === false) {
                _.forEach(productRows, function(row) {                
                    if($(row).find(".olga-listing-title").text() === product.title) {
                        found = true;
                    }                
                });
                chai.assert.isTrue(found, "couldn't find " + product.title);
            }
        });

        done();
    });

    it("shows correct statistics for each product", function(done) {
        var component = ReactTestUtils.renderIntoDocument(
            <SupplierProductsContainer />
        );
        var productRows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "rt-tr-group");

        _.forEach(productRows, function(row) {
            let title = $(row).find(".olga-listing-title").text();
            $(row).find(".olga-listing-btn-success").each(function() {
                let btnText = $(this).text().split(" ");   
                chai.assert.equal(btnText[1], getProductStats(title, btnText[0]), "Stat " + btnText[0] + " wrong for product " + title);
            })
        });

        done();
    });

    it("should open SupplyContractModal", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let productRow = wrapper.find(".rt-tr-group").at(1);
        let button = productRow.find(".olga-listing-btn-success");

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(0).prop('isOpen'), true, "Modal not found");

        done();
    });

    it("should open SupplyContractModal with correct info", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let productRow = wrapper.find(".rt-tr-group").at(1);
        let button = productRow.find(".olga-listing-btn-success");
        let productTitle = productRow.find(".olga-listing-title").first().text();

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(0).prop('isOpen'), true, "Modal not found");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).at(0).node.portal, true);
        chai.assert.equal(modalWrapper.find("#contractModalTitle").first().text(), productTitle, 
            "Modal title doesn'tmatch product title");
        chai.assert.equal(modalWrapper.find('#openQuantity').first().text(), "6", 
            "Modal open quantity is incorrect");

        done();
    });

    it("should close cancelled SupplyContractModal without calling server method", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let productRow = wrapper.find(".rt-tr-group").at(1);
        let button = productRow.find(".olga-listing-btn-success");
        let spy = sinon.spy(Meteor, "call");

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(0).prop('isOpen'), true, "Modal is not open");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).at(0).node.portal, true);
        let cancelButton = modalWrapper.find("#cancelContractModal");
        cancelButton.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(0).prop('isOpen'), false, "Modal is not closed");
        chai.assert.isFalse(spy.called, "Server method was called");

        Meteor.call.restore();
        done();
    });

    it("should close confirmed SupplyContractModal and call server method", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let productRow = wrapper.find(".rt-tr-group").at(1);
        let button = productRow.find(".olga-listing-btn-success");
        let spy = sinon.spy(Meteor, "call");

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(0).prop('isOpen'), true, "Modal is not open");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).at(0).node.portal, true);
        let quantityInput = modalWrapper.find("#quantity").first();
        quantityInput.simulate("change", { target: { value: 1 } });

        let confirmButton = modalWrapper.find("#confirmContract");
        confirmButton.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(0).prop('isOpen'), false, "Modal is not closed");
        chai.assert.isTrue(spy.calledOnce, "Server method was not called");
        var args = spy.getCalls()[0].args;
        chai.assert.isTrue(spy.calledWith("supplyContracts/create", testProducts[4]._id, 1), "Wrong server method called");

        Meteor.call.restore();
        done();
    });

    it("should close confirmed SupplyContractModal with 0 quantity without calling server method", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let productRow = wrapper.find(".rt-tr-group").at(1);
        let button = productRow.find(".olga-listing-btn-success");
        let spy = sinon.spy(Meteor, "call");

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(0).prop('isOpen'), true, "Modal is not open");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).at(0).node.portal, true);
        let quantityInput = modalWrapper.find("#quantity").first();
        quantityInput.simulate("change", { target: { value: 0 } });

        let confirmButton = modalWrapper.find("#confirmContract");
        confirmButton.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(0).prop('isOpen'), false, "Modal is not closed");
        chai.assert.isFalse(spy.called, "Server method was called");

        Meteor.call.restore();
        done();
    });

    it("should open DeliveryModal", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let productRow = wrapper.find(".rt-tr-group").at(1);
        let button = productRow.find(".contracted-btn");

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(1).prop('isOpen'), true, "Modal not found");

        done();
    });

    it("should open DeliveryModal with correct info", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let productRow = wrapper.find(".rt-tr-group").at(1);
        let button = productRow.find(".contracted-btn");
        let productTitle = productRow.find(".olga-listing-title").first().text();

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).at(1).prop('isOpen'), true, "Modal not found");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).at(1).node.portal, true);
        chai.assert.equal(modalWrapper.find("#contractModalTitle").first().text(), productTitle, 
            "Modal title doesn'tmatch product title");
        chai.assert.equal(modalWrapper.find('#contractedQuantity').first().text(), "1", 
            "Modal open quantity is incorrect");

        done();
    });
});

/**
 * Helper function to calculate a Product stat from test data.
 * @param {String} title Product Title
 * @param {String} stat Which stat should be calculated
 */
function getProductStats(title, stat) {
    let productId = _.find(testProducts, function(p) {
        if(p.title === title)
            return true;
    })._id;
    let orderCount = 0;
    let orderedQuantity = 0;    
    let openOrderCount = 0;
    let contractedQuantity = 0;
    let sentQuantity = 0;

    _.forEach(testOrders, function(o) {
        _.forEach(o.items, function(item) {
            if(item.variants._id === productId) {
                orderCount++;
                orderedQuantity += item.quantity;
            }
        });
        _.forEach(o.productSupplies, function(productSupply) {
            if(productSupply.productId === productId) {
                openOrderCount += productSupply.openQuantity;
            }
        });
    });

    _.forEach(testContracts, function(c) {
        if(c.productId === productId) {
            contractedQuantity += c.contractedQuantity;
            sentQuantity += c.sentQuantity;
        }
    });

    switch (stat) {
        case "Avoinna":
            return openOrderCount;
        case "Tilauksia":
            return orderCount;
        case "Tilattu":
            return orderedQuantity;
        case "Sovittu":
            return contractedQuantity;
        case "Toimitettu":
            return sentQuantity;
    }
}