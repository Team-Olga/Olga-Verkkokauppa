import { Meteor } from "meteor/meteor";
import { chai } from "meteor/practicalmeteor:chai";
import { Factory } from "meteor/dburles:factory";
import { Random } from "meteor/random";
import StubCollections from "meteor/hwillson:stub-collections";
import { sinon } from "meteor/practicalmeteor:sinon";
import { $ } from 'meteor/jquery';
import { Reaction } from "/server/api";
import { Products, Orders } from "/lib/collections";
import { SupplyContracts } from "../../collections";

describe("SupplyContracts methods test", function() {
    let methods;
    let sandbox;
    let testProducts;
    let testOrders;
    let testSupplyContracts;

    before(function(done){
        console.log("SupplyContracts: " + SupplyContracts);
        methods = {
            "createSupplyContract": Meteor.server.method_handlers["supplyContracts.create"],
            "supplyContracts/delete": Meteor.server.method_handlers["supplyContracts/delete"]
        };
        return done();
    });

    beforeEach(function(done) {
        StubCollections.stub([Products, Orders, SupplyContracts]);
        Template.registerHelper('_', key => key);
        sandbox = sinon.sandbox.create();

        Factory.define('olga.product', Products, {
            _id: Random.id(),
            title: "TestProduct",
            ancestors: [],
            createdAt: Date.now(),

        });

        Factory.define('olga.order', Orders, {
            _id: Random.id(),
            items: [
                {variants: 
                    {_id:  Random.id()}
                }
            ],
            createdAt: Date.now()
        });

        Factory.define('supplyContract', SupplyContracts, {
            _id: Random.id(),
            userId: Random.id(),
            orderId: Random.id(),
            productId: Random.id(),
            quantity: 0
        });

        testProducts = [];
        testOrders = [];
        testSupplyContracts = [];

        _.times(3, function (index) {
            let product = Factory.create('olga.product', {
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

        let order0 = Factory.create('olga.order', {
                _id: Random.id(),
                items: items0
            });
        testOrders.push(order0);

        let order1 = Factory.create('olga.order', {
                _id: Random.id(),
                items: items1
            });
        testOrders.push(order1);

        let supplyContract0 = Factory.create('supplyContract', { });
        testSupplyContracts.push(supplyContract0);

        done();
    });

    afterEach(function (done) {
        StubCollections.restore();
        Template.deregisterHelper('_');
        sandbox.restore();
        done();
    });

    it("creates a supplyContract when one order covers the quantity", function() {

        chai.assert.equal(1, 0);
    });

    it("throws error if there are no orders waiting for supplyContract", function() {
        chai.assert.equal(1, 0);
    });

    it("creates supplyContracts when multiple orders cover the quantity", function() {
        chai.assert.equal(1, 0);
    });

    it("deletes a supplyContract when user is admin", function() {
        sandbox.stub(Reaction, "hasAdminAccess", () => true);

        return Meteor.call("supplyContracts/delete", testSupplyContracts[0]._id);
        chai.assert(SupplyContracts.remove.calledOnce,
            "Collection remove not called exactly once");
        chai.assert(SupplyContracts.remove.withArgs(testSupplyContracts[0]._id).calledOnce,
            "Collection remove method called with wrong argument");  
    });

    it("throws error if non-admin tries to delete a supplyContract", function() {
        sandbox.stub(Reaction, "hasAdminAccess", () => false); 

        function deleteContract() {
            return Meteor.call("supplyContracts/delete", testSupplyContracts[0]._id);
        }
        chai.assert(SupplyContracts.remove.notCalled,
            "Collection remove was called");
        chai.expect(deleteContract).to.throw(Meteor.Error, /Access Denied/,
            "No error even though user has no admin access");
    });

})