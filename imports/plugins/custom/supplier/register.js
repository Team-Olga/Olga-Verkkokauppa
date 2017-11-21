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
      icon: "fa fa-vine",
      label: "My Products",
      template: "supplierProducts",
      workflow: "coreProductGridWorkflow"
    },
    {
      route: "/supplier/contracts",
      name: "supplier/contracts",
      layout: "coreLayoutOlga",
      provides: ["supplierAccountDropdown"],
      icon: "fa fa-vine",
      label: "My Contracts",
      template: "supplierContracts",
      workflow: "coreProductGridWorkflow"
    }
  ]
});