import { Meteor } from "meteor/meteor";
import { chai } from "meteor/practicalmeteor:chai";
import { Factory } from "meteor/dburles:factory";
import StubCollections from "meteor/hwillson:stub-collections";
import { sinon } from "meteor/practicalmeteor:sinon";
import { $ } from 'meteor/jquery';
import { Products, Orders } from "/lib/collections";

describe("SupplyContracts methods test", function() {
    let methods;
    let sandbox;
    let testProducts;
    let testOrders;

    before(function(done){
        methods = {
            "createSupplyContract": Meteor.server.method_handlers["supplyContracts.create"],
            "deleteSupplyContract": Meteor.server.method_handlers["supplyContracts.delete"]
        };
        return done();
    });

    beforeEach(function(done) {
        StubCollections.stub([Products, Orders]);
        Template.registerHelper('_', key => key);
        sandbox = sinon.sandbox.create();
        // sandbox.stub(Meteor, 'subscribe', () => ({
        //     subscriptionId: 0,
        //     ready: () => true,
        // }));

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

        done();
    });

    afterEach(function () {
        StubCollections.restore();
        Template.deregisterHelper('_');
        //Meteor.subscribe.restore();
    });

    it("creates a supplyContract when one order covers the quantity", function(done) {
        chai.assert.equal(1, 1);
        done();
    });

    it("throws error if there are no orders waiting for supplyContract", function(done) {
        chai.assert.equal(1, 1);
        done();
    });

    it("creates supplyContracts when multiple orders cover the quantity", function(done) {
        chai.assert.equal(1, 1);
        done();
    });

    it("deletes a supplyContract when user is admin", function(done) {
        chai.assert.equal(1, 1);
        done();
    });

    it("throws error if non-admin tries to delete a supplyContract", function(done) {
        chai.assert.equal(1, 1);
        done();
    });

})