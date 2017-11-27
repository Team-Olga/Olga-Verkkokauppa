//export * as Collections from "./lib/collections";
import * as CustomGroups from "./addCustomGroups";
import './publications';
import { Reaction, Hooks } from "/server/api";


Hooks.Events.add("afterCoreInit", () => {
  CustomGroups.createCustomGroups();
});