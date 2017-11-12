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
import ReactTestUtils from "react-addons-test-utils";

import { Products, Accounts } from "/lib/collections";
import { SupplyContracts } from "../../../lib/collections";

import ContractContainer from "../../containers/contracts/contractContainer";

var testProducts;
var testAccounts;
var testContracts;

describe("ContractList", function(done) {

    beforeEach(function() {
        StubCollections.stub([Products, Accounts, SupplyContracts]);
        Template.registerHelper('_', key => key);
        sinon.stub(Meteor, 'subscribe', () => ({
            subscriptionId: 0,
            ready: () => true,
        }));

        Factory.define('product', Products, {
            _id: Random.id(),
            title: "TestProduct",
            ancestors: [],
            createdAt: new Date(),

        });

        Factory.define('account', Accounts, {
            _id: Random.id(),
            name: "xName",
        });

        Factory.define('contract', SupplyContracts, {
            _id: Random.id(),
            userId: Random.id(),
            orders: [],
            productId: Random.id(),
            quantity: 0,
            sentQuantity: 0,
            receivedQuantity: 0,
            createdAt: new Date()
        });

        testProducts = [];
        testAccounts = [];
        testContracts = [];

        _.times(3, function (index) {
            let product = Factory.create('product', {
                _id: Random.id(),
                title: "Test " + index,
            });
            testProducts.push(product);
        });

        _.times(3, function (index) {
            let account = Factory.create('account', {
                _id: Random.id(),
                name: "TestAcc " + index,
            });
            testAccounts.push(account);
        });

        let contract0 = Factory.create('contract', {
            _id: Random.id(),
            userId: testAccounts[1]._id,
            orders: [],
            productId: testProducts[1]._id,
            quantity: 2,
            sentQuantity: 0,
            receivedQuantity: 0,
            createdAt: new Date()
        });
        testContracts.push(contract0);

        let contract1 = Factory.create('contract', {
            _id: Random.id(),
            userId: testAccounts[1]._id,
            orders: [],
            productId: testProducts[2]._id,
            quantity: 3,
            sentQuantity: 0,
            receivedQuantity: 0,
            createdAt: new Date()
        });
        testContracts.push(contract1);

        let contract2 = Factory.create('contract', {
            _id: Random.id(),
            userId: testAccounts[2]._id,
            orders: [],
            productId: testProducts[1]._id,
            quantity: 7,
            sentQuantity: 0,
            receivedQuantity: 0,
            createdAt: new Date()
        });
        testContracts.push(contract2);

    });

    afterEach(function() {
        StubCollections.restore();
        Template.deregisterHelper('_');
        Meteor.subscribe.restore();
    });

    it("renders all contracts with correct data", function(done) {
        var component = ReactTestUtils.renderIntoDocument(
            <ContractContainer />
        );
        var contractRows = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, "supplier-product-row");
        chai.assert.equal(contractRows.length, testContracts.length, "wrong number of supply contract items");
        let row = contractRows[0];
        chai.assert.equal($(row).find(".olga-product").text().trim(), testProducts[1].title, "Wrong product title on first row");
        chai.assert.equal($(row).find(".olga-supplier").text().trim(), testAccounts[1].name, "Wrong supplier name on first row");
        let detailParts = $(row).find(".olga-quantity").text().trim().split(" ");
        chai.assert.equal(detailParts[detailParts.length - 2], testContracts[0].quantity.toString(), "Wrong quantity on first row");

        row = contractRows[1];
        chai.assert.equal($(row).find(".olga-product").text().trim(), testProducts[2].title, "Wrong product title on first row");
        chai.assert.equal($(row).find(".olga-supplier").text().trim(), testAccounts[1].name, "Wrong supplier name on first row");
        detailParts = $(row).find(".olga-quantity").text().trim().split(" ");
        chai.assert.equal(detailParts[detailParts.length - 2], testContracts[1].quantity.toString(), "Wrong quantity on first row");

        row = contractRows[2];
        chai.assert.equal($(row).find(".olga-product").text().trim(), testProducts[1].title, "Wrong product title on first row");
        chai.assert.equal($(row).find(".olga-supplier").text().trim(), testAccounts[2].name, "Wrong supplier name on first row");
        detailParts = $(row).find(".olga-quantity").text().trim().split(" ");
        chai.assert.equal(detailParts[detailParts.length - 2], testContracts[2].quantity.toString(), "Wrong quantity on first row");

        done();

    });

});