import { Template } from "meteor/templating";
import { Components } from "@reactioncommerce/reaction-components";

Template.supplierOverview.helpers({
  component() {
    const currentData = Template.currentData() || {};
    return {
      ...currentData,
      component: Components.OverviewDashboard
    };
  }
});