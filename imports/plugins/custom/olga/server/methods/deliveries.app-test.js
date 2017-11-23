import { Meteor } from "meteor/meteor";
import { chai } from "meteor/practicalmeteor:chai";
import { Factory } from "meteor/dburles:factory";
import { Random } from "meteor/random";
import StubCollections from "meteor/hwillson:stub-collections";
import { sinon } from "meteor/practicalmeteor:sinon";
import { Reaction } from "/server/api";
import { UserChecks } from "../../lib/userChecks";
import { addProduct } from "/server/imports/fixtures/products";
import Fixtures from "/server/imports/fixtures";
import { Products, Orders } from "/lib/collections";
import { Deliveries, SupplyContracts } from "../../lib/collections";
import { delimiter } from "path";

Fixtures();

describe("Deliveries methods test", function() {
    this.timeout(5000);

    let methods;
    let sandbox;
    let testProducts;
    let testSupplyContracts;
    let testDeliveries;

    before(function() {
        methods = {
            "createDelivery": Meteor.server.method_handlers["deliveries.create"]
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
        testSupplyContracts = [];
        testDeliveries = [];

        _.times(4, function(index) {
            testProducts.push(addProduct());
        });

        let adminId = Random.id();
        let supplierId = Random.id();

        testSupplyContracts.push(
            {
                userId: adminId,
                productId: testProducts[0]._id,
                quantity: 5,
                sentQuantity: 3,
                receivedQuantity: 2,
            }
        );

        testSupplyContracts.push(
            {
                userId: adminId,
                productId: testProducts[0]._id,
                quantity: 2,
                sentQuantity: 0,
                receivedQuantity: 0,
            }
        );

        testSupplyContracts.push(
            {
                userId: adminId,
                productId: testProducts[0]._id,
                quantity: 7,
                sentQuantity: 0,
                receivedQuantity: 0,
            }
        );

        let i;
        for(i = 0; i < testSupplyContracts.length; i++) {
            let contractId = SupplyContracts.insert(testSupplyContracts[i]);
            testSupplyContracts[i]._id = contractId;
        }

        return done();
    });

    afterEach(function(done) {
        Products.direct.remove({});
        SupplyContracts.direct.remove({});
        Deliveries.direct.remove({});
        sandbox.restore();
    });

    it("should throw error if non-admin/non-supplier tries to create a delivery", function(done) {
        sandbox.stub(Reaction, "hasAdminAccess", () => false); 
        sandbox.stub(UserChecks.prototype, "isInRole", () => false);

        const insertDeliverySpy = sandbox.spy(Deliveries, "insert");
        chai.expect(() => Meteor.call("deliveries/create", testProducts[0]._id), 2)).to.throw(Meteor.Error, /Access Denied/);
        chai.expect(insertDeliverySpy).to.not.have.been.called;

        return done();
    });

    it("should not create a delivery if no supplycontracts are waiting for delivery", function(done) {
        sandbox.stub(Reaction, "hasAdminAccess", () => true); 
        sandbox.stub(UserChecks.prototype, "isInRole", () => true);

        const insertDeliverySpy = sandbox.spy(Deliveries, "insert");
        Meteor.call("deliveries/create", testProducts[1]._id, 2);
        chai.expect(insertDeliverySpy).to not have been called;

        return done();
    });

    it("should create a delivery when one supplycontract covers the quantity", function(done) {
        sandbox.stub(Reaction, "hasAdminAccess", () => true); 
        sandbox.stub(UserChecks.prototype, "isInRole", () => true);

        const insertDeliverySpy = sandbox.spy(Deliveries, "insert");
        const updateDeliverySpy = sandbox.spy(Deliveries, "update");
        const updateContractSpy = sandbox.spy(SupplyContracts, "update");

        let deliveries = Deliveries.find({}).fetch();
        chai.expect(deliveries.length).to.equal(0);

        Meteor.call("deliveries/create", testProducts[0]._id, 2);
        chai.expect(insertDeliverySpy).to.have.been.called.once;
        chai.expect(updateDeliverySpy).to.have.been.called.once;
        chai.expect(updateContractSpy).to.have.been.called.once;

        deliveries = Deliveries.find({}).fetch();
        chai.expect(deliveries.length).to.equal(1);
        chai.expect(deliveries[0].productId).to.equal(testProducts[0]._id);
        chai.expect(deliveries[0].deliveryQuantity).to.equal(2);
        chai.expect(deliveries[0].supplyContracts.length).to.equal(1);
        chai.expect(deliveries[0].supplyContracts[0]).to.equal(testSupplyContracts[0]._id);

        return done();
    });

    // it("should create a delivery when one supplycontract more than covers the quantity", function(done) {

    //     return done();
    // });

    // it("should create a delivery when multiple supplycontracts cover the quantity", function(done) {

    //     return done();
    // });

});