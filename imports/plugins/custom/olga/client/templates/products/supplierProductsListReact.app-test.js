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
                if($(row).find(".olga-listing-title").text() === product.title) {
                    found = true;
                }                
            });
            chai.assert.isTrue(found, "couldn't find " + product.title);
        });

        done();
    });

    it("shows correct statistics for each product", function(done) {
        var component = ReactTestUtils.renderIntoDocument(
            <SupplierProductsContainer />
        );
        var productRows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "supplier-product-row");

        _.forEach(productRows, function(row) {
            let title = $(row).find(".olga-listing-title").text();
            console.log("Prodcut: " + title);
            $(row).find(".olga-listing-btn-success").each(function() {
                console.log("Button: " + $(this).text());
                let btnText = $(this).text().split(" ");   
                console.log("")
                chai.assert.equal(btnText[1], getProductStats(title, btnText[0]), "Stat " + btnText[0] + " wrong for product " + title);
            })
        });

        done();
    });

    it("should open SupplyContractModal", function(done) {
        var component = ReactTestUtils.renderIntoDocument(
            <SupplierProductsContainer />
        );
        var  buttons = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "olga-listing-btn-success");
        chai.assert.equal(buttons.length, 3, "Wrong number of buttons found.");
        ReactTestUtils.Simulate.click(buttons[0]);
        var modal = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "contractModalOverlay");
        chai.assert.isNotNull(modal, "Modal is not open");
        done();
    });

    it("should open SupplyContractModal with correct info", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let productRow = wrapper.find(".supplier-product-row").at(1);
        let button = productRow.find(".olga-listing-btn-success");
        let productTitle = productRow.find(".olga-listing-title").first().text();

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).prop('isOpen'), true, "Modal not found");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).node.portal, true);
        chai.assert.equal(modalWrapper.find("#contractModalTitle").first().text(), productTitle, 
            "Modal title doesn'tmatch product title");
        chai.assert.equal(modalWrapper.find('#openQuantity').first().text(), 7, 
            "Modal open quantity is incorrect");

        done();
    });

    it("should close cancelled SupplyContractModal without calling server method", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let button = wrapper.find(".supplier-product-row").at(1).find(".olga-listing-btn-success");
        let spy = sinon.spy(Meteor, "call");

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).prop('isOpen'), true, "Modal is not open");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).node.portal, true);
        let cancelButton = modalWrapper.find("#cancelModal");
        cancelButton.simulate('click');
        chai.assert.equal(wrapper.find(Modal).prop('isOpen'), false, "Modal is not closed");
        chai.assert.isFalse(spy.called, "Server method was called");

        Meteor.call.restore();
        done();
    });

    it("should close confirmed SupplyContractModal and call server method", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let button = wrapper.find(".supplier-product-row").at(1).find(".olga-listing-btn-success");
        let spy = sinon.spy(Meteor, "call");

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).prop('isOpen'), true, "Modal is not open");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).node.portal, true);
        let quantityInput = modalWrapper.find("#quantity").first();
        quantityInput.simulate("change", { target: { value: 1 } });

        let confirmButton = modalWrapper.find("#confirmContract");
        confirmButton.simulate('click');
        chai.assert.equal(wrapper.find(Modal).prop('isOpen'), false, "Modal is not closed");
        chai.assert.isTrue(spy.calledOnce, "Server method was not called");
        var args = spy.getCalls()[0].args;
        _.forEach(args, function(arg) {
            console.log("Argumentti: " + arg);
        });
        chai.assert.isTrue(spy.calledWith("supplyContracts/create", testProducts[1]._id, 1), "Wrong server method called");

        Meteor.call.restore();
        done();
    });

    it("should close confirmed SupplyContractModal with 0 quantity without calling server method", function(done) {
        const wrapper = mount(<SupplierProductsContainer />);
        let button = wrapper.find(".supplier-product-row").at(1).find(".olga-listing-btn-success");
        let spy = sinon.spy(Meteor, "call");

        button.simulate('click');
        chai.assert.equal(wrapper.find(Modal).prop('isOpen'), true, "Modal is not open");
        let modalWrapper = new ReactWrapper(wrapper.find(Modal).node.portal, true);
        let quantityInput = modalWrapper.find("#quantity").first();
        quantityInput.simulate("change", { target: { value: 0 } });

        let confirmButton = modalWrapper.find("#confirmContract");
        confirmButton.simulate('click');
        chai.assert.equal(wrapper.find(Modal).prop('isOpen'), false, "Modal is not closed");
        chai.assert.isFalse(spy.called, "Server method was called");

        Meteor.call.restore();
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