import { Mongo } from "meteor/mongo";
import * as Schemas from "./schemas";
import { Orders } from "/lib/collections/collections";

export const SupplyContracts = new Mongo.Collection("SupplyContracts");
SupplyContracts.attachSchema(Schemas.SupplyContract);

Orders.attachSchema(Schemas.Order);
