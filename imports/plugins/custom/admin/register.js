import { Reaction } from "/server/api";

// Register package as ReactionCommerce package
Reaction.registerPackage({
  label: "Admin Supplier",
  name: "admin supplier",
  icon: "fa fa-vine",
  autoEnable: true,

  layout: [{
    layout: "coreLayoutOlga",
    workflow: "coreProductGridWorkflow",
    theme: "default",
    enabled: true,
    structure: {
      // template: "productsLanding",
      template: "products",
      layoutHeader: "layoutHeader",
      layoutFooter: "layoutFooterOlga",
      notFound: "productNotFound",
      dashboardHeader: "",
      dashboardControls: "dashboardControls",
      dashboardHeaderControls: "",
      adminControlsFooter: "adminControlsFooter"
    }
  }],
  registry: [
    {
      route: "/admin/overview",
      name: "admin/overview",
      layout: "coreLayoutOlga",
      provides: ["shortcut"],
      audience: ["dashboard"],
      icon: "fa fa-vine",
      label: "Admin Overview",
      template: "adminOverview",
      workflow: "coreProductGridWorkflow"
    }
  ]
});