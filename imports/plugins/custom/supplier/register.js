import { Reaction } from "/server/api";

// Register package as ReactionCommerce package
Reaction.registerPackage({
  label: "Supplier",
  name: "supplier",
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
      route: "/supplier/products",
      name: "supplier/products",
      layout: "coreLayoutOlga",
      provides: ["supplierAccountDropdown"],
      audience: ["supplier"],
      icon: "fa fa-vine",
      label: "Products",
      template: "supplierProducts",
      workflow: "coreProductGridWorkflow"
    },
    {
      route: "/supplier/overview",
      name: "supplier/overview",
      layout: "coreLayoutOlga",
      provides: ["supplierAccountDropdown"],
      audience: ["supplier"],
      icon: "fa fa-vine",
      label: "Supplier Overview",
      template: "supplierOverview",
      workflow: "coreProductGridWorkflow"
    },/*
    {
      route: "/supplier/contracts",
      name: "supplier/contracts",
      layout: "coreLayoutOlga",
      provides: ["supplierAccountDropdown"],
      audience: ["supplier"],
      icon: "fa fa-vine",
      label: "Contracts",
      template: "supplierContracts",
      workflow: "coreProductGridWorkflow"
    },*/
/*    {
      route: "/admin/contracts",
      name: "admin/contracts",
      layout: "coreLayoutOlga",
      provides: ["shortcut"],
      audience: ["dashboard"],
      icon: "fa fa-vine",
      label: "Admin Contracts",
      template: "adminContracts",
      workflow: "coreProductGridWorkflow"
    }*/
  ]
});