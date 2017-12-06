import { Reaction, Hooks } from "/server/api";

import './publications';
import './hooks';
import './methods';

import * as CustomGroups from "./addCustomGroups";

Hooks.Events.add("afterCoreInit", () => {
  CustomGroups.createCustomGroups();
});