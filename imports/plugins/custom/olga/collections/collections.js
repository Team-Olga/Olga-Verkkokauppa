import { Mongo } from "meteor/mongo";
import * as Schemas from "./schemas";
import { CartItem as CartItemSchema } from "/lib/collections/schemas/cart";
import { Orders } from "/lib/collections/collections";

export const SupplyContracts = new Mongo.Collection("SupplyContracts");
SupplyContracts.attachSchema(Schemas.SupplyContract);

//Orders.attachSchema(CartItemSchema);
// johtuisko error siitä että ei ole nimenomaan sekä serverin että clientin puolella?