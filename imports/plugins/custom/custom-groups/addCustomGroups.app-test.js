import { sinon } from "meteor/practicalmeteor:sinon";
import { expect } from "meteor/practicalmeteor:chai";
import { Groups } from "/lib/collections";
import * as CustomGroups  from "./addCustomGroups";

describe("CustomGroups", function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("createCustomGroups", () => {

    it("should add producer-group with default permissions", () => {
      CustomGroups.createCustomGroups();
      
      let group = Groups.findOne({
        slug: "producer"
      });

      expect(group.permissions).to.have.members(CustomGroups.defaultProducerRoles);
    });
  });
});
