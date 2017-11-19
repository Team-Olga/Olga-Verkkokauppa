import { Meteor } from "meteor/meteor";
import { chai } from "meteor/practicalmeteor:chai";
import { Factory } from "meteor/dburles:factory";
import { Random } from "meteor/random";
import StubCollections from "meteor/hwillson:stub-collections";
import { sinon } from "meteor/practicalmeteor:sinon";
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { $ } from 'meteor/jquery';
import { Reaction } from "/server/api";
import { Roles } from "meteor/alanning:roles";
import { UserChecks } from "../../lib/userChecks";
import { addProduct } from "/server/imports/fixtures/products";
import Fixtures from "/server/imports/fixtures";
import { Products, Orders } from "/lib/collections";
import { SupplyContracts } from "../../lib/collections";

Fixtures();

describe("SupplyContracts methods test", function() {
    this.timeout(5000);

    let methods;
    let sandbox;
    let testProducts;
    let testOrders;
    let testSupplyContracts;    

    before(function(){
        methods = {
            "createSupplyContract": Meteor.server.method_handlers["supplyContracts.create"],
            "supplyContracts/delete": Meteor.server.method_handlers["supplyContracts/delete"]
        };
    });

    beforeEach(function(done) {
        this.timeout(5000);
        sandbox = sinon.sandbox.create();
        sandbox.stub(Orders._hookAspects.insert.before[0], "aspect");
        sandbox.stub(Orders._hookAspects.update.before[0], "aspect");
        sandbox.stub(Meteor.server.method_handlers, "inventory/register", function () {
            check(arguments, [Match.Any]);
          });
          sandbox.stub(Meteor.server.method_handlers, "inventory/sold", function () {
            check(arguments, [Match.Any]);
          });

        let order = Factory.create("order");
        sandbox.stub(Reaction, "getShopId", () => order.shopId);

        testProducts = [];
        testOrders = [];
        testSupplyContracts = [];

        _.times(4, function(index) {
            testProducts.push(addProduct());
        });

        let productSupplies = [];
        productSupplies.push([
            {
                productId: testProducts[0]._id,
                supplyContracts: [],
                openQuantity: 3
            },
            {
                productId: testProducts[2]._id,
                supplyContracts: [],
                openQuantity: 3
            }
        ]);
        productSupplies.push([
            {
                productId: testProducts[2]._id,
                supplyContracts: [],
                openQuantity: 3
            },
            {
                productId: testProducts[1]._id,
                supplyContracts: [],
                openQuantity: 3
            }
        ]);
        productSupplies.push([
            {
                productId: testProducts[2]._id,
                supplyContracts: [],
                openQuantity: 2
            },
            {
                productId: testProducts[0]._id,
                supplyContracts: [],
                openQuantity: 2
            }
        ]);
        productSupplies.push([
            {
                productId: testProducts[2]._id,
                supplyContracts: [],
                openQuantity: 9
            },
            {
                productId: testProducts[1]._id,
                supplyContracts: [],
                openQuantity: 9
            }
        ]);
        productSupplies.push([
            {
                productId: testProducts[2]._id,
                supplyContracts: [],
                openQuantity: 1
            },
            {
                productId: testProducts[1]._id,
                supplyContracts: [],
                openQuantity: 1
            }
        ]);

        _.times(5, function(index) {
            let order = Factory.create("order");
            Orders.update(order._id, {
                $set: {
                    productSupplies: productSupplies[index]
                }
            });
            testOrders.push(Orders.find({ _id: order._id }));
        });

        

        return done();
    });

    afterEach(function () {
        Products.direct.remove({});
        Orders.direct.remove({});
        SupplyContracts.direct.remove({});
        sandbox.restore();
    });

    it("should throw error if non-admin/non-supplier tries to create a supplyContract", function(done) {
        sandbox.stub(Reaction, "hasAdminAccess", () => false); 
        sandbox.stub(Roles, "userIsInRole", () => false);
        
        const insertContractSpy = sandbox.spy(SupplyContracts, "insert");
        chai.expect(() => Meteor.call("supplyContracts/create", testProducts[0]._id, 3)).to.throw(Meteor.Error, /Access Denied/);
        chai.expect(insertContractSpy).to.not.have.been.called;
        
        return done();
    });

    it("should not create a supplyContract if no orders are waiting for supply", function(done) {
        sandbox.stub(Reaction, "hasAdminAccess", () => true); 
        sandbox.stub(Roles, "userIsInRole", () => true);

        const insertContractSpy = sandbox.spy(SupplyContracts, "insert");
        Meteor.call("supplyContracts/create", testProducts[3]._id, 1);
        chai.expect(insertContractSpy).to.not.have.been.called;

        return done();
    });

    it("should create a supplyContract when one order exactly covers the quantity", function(done) {
        sandbox.stub(Reaction, "hasAdminAccess", () => true); 
        sandbox.stub(Roles, "userIsInRole", () => true);
        sandbox.stub(Meteor, "userId", () => Random.id());
        
        const insertContractSpy = sandbox.spy(SupplyContracts, "insert");
        const updateContractSpy = sandbox.spy(SupplyContracts, "update");
        const updateOrderSpy = sandbox.spy(Orders, "update");

        let contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(0);

        Meteor.call("supplyContracts/create", testProducts[2]._id, 3);
        chai.expect(insertContractSpy).to.have.been.called.once;
        chai.expect(updateContractSpy).to.have.been.called.once;
        chai.expect(updateOrderSpy).to.have.been.called.once

        contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(1);
        chai.expect(contracts[0].productId).to.equal(testProducts[2]._id);
        chai.expect(contracts[0].quantity).to.equal(3);
        chai.expect(contracts[0].orders.length).to.equal(1);

        return done();
    });

    it("should create a supplyContract when one order more than covers the quantity", function(done) {
        sandbox.stub(Reaction, "hasAdminAccess", () => true); 
        sandbox.stub(Roles, "userIsInRole", () => true);
        sandbox.stub(Meteor, "userId", () => Random.id());
        
        const insertContractSpy = sandbox.spy(SupplyContracts, "insert");
        const updateContractSpy = sandbox.spy(SupplyContracts, "update");
        const updateOrderSpy = sandbox.spy(Orders, "update");

        let contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(0);

        Meteor.call("supplyContracts/create", testProducts[1]._id, 1);
        chai.expect(insertContractSpy).to.have.been.called.once;
        chai.expect(updateContractSpy).to.have.been.called.once;
        chai.expect(updateOrderSpy).to.have.been.called.once

        contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(1);
        chai.expect(contracts[0].productId).to.equal(testProducts[1]._id);
        chai.expect(contracts[0].quantity).to.equal(1);
        chai.expect(contracts[0].orders.length).to.equal(1);

        return done();
    });

    it("should create a supplyContract when multiple orders cover the quantity", function(done) {
        sandbox.stub(Reaction, "hasAdminAccess", () => true); 
        sandbox.stub(Roles, "userIsInRole", () => true);
        sandbox.stub(Meteor, "userId", () => Random.id());
        
        const insertContractSpy = sandbox.spy(SupplyContracts, "insert");
        const updateContractSpy = sandbox.spy(SupplyContracts, "update");
        const updateOrderSpy = sandbox.spy(Orders, "update");

        let contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(0);

        Meteor.call("supplyContracts/create", testProducts[2]._id, 7);
        chai.expect(insertContractSpy).to.have.been.called.once;
        chai.expect(updateContractSpy).to.have.been.called.once;
        chai.expect(updateOrderSpy).to.have.been.called.once

        contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(1);
        chai.expect(contracts[0].productId).to.equal(testProducts[2]._id);
        chai.expect(contracts[0].quantity).to.equal(7);
        chai.expect(contracts[0].orders.length).to.equal(3);

        return done();
    });

    it("should delete a supplyContract when user is admin", function() {
        sandbox.stub(Reaction, "hasAdminAccess", () => true);

        let newContractId = SupplyContracts.insert({
            userId: Random.id(),
            orders: [],
            productId: Random.id(),
            quantity: 7,
            sentQuantity: 0,
            receivedQuantity: 0
        });
        testSupplyContracts.push(SupplyContracts.find({ _id: newContractId }));
    
        const removeContractSpy = sandbox.spy(SupplyContracts, "remove");
        let contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(1);
        Meteor.call("supplyContracts/delete", newContractId);
        chai.expect(removeContractSpy).to.have.been.called.once;
        contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(0);
    });

    it("should throw error if non-admin tries to delete a supplyContract", function() {
        sandbox.stub(Reaction, "hasAdminAccess", () => false); 

        let newContractId = SupplyContracts.insert({
            userId: Random.id(),
            orders: [],
            productId: Random.id(),
            quantity: 7,
            sentQuantity: 0,
            receivedQuantity: 0
        });
        testSupplyContracts.push(SupplyContracts.find({ _id: newContractId }));

        let contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(1);
        const removeContractSpy = sandbox.spy(SupplyContracts, "remove");
        chai.expect(() => Meteor.call("supplyContracts/delete", newContractId)).to.throw(Meteor.Error, /Access Denied/);
        chai.expect(removeContractSpy).to.not.have.been.called;
        contracts = SupplyContracts.find({}).fetch();
        chai.expect(contracts.length).to.equal(1);
    });

})