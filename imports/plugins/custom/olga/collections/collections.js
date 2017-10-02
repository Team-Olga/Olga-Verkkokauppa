import { Mongo } from "meteor/mongo";
import * as Schemas from "./schemas";

export const SupplyContracts = new Mongo.Collection("SupplyContracts");
SupplyContracts.attachSchema(Schemas.SupplyContract);
