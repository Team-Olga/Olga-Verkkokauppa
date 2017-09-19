import { Reaction } from "/server/api";

// Register package as ReactionCommerce package
Reaction.registerPackage({
  label: "Olga",
  name: "olga",
  icon: "fa fa-vine",
  autoEnable: true,
  layout: [{
    layout: "coreLayoutOlga",
    workflow: "coreProductGridWorkflow",
    collection: "Products",
    theme: "default",
    enabled: true,
    structure: {
      //template: "productsLanding",
      template: "products",
      layoutHeader: "layoutHeader",
      layoutFooter: "layoutFooter",
      notFound: "productNotFound",
      dashboardHeader: "",
      dashboardControls: "dashboardControls",
      dashboardHeaderControls: "",
      adminControlsFooter: "adminControlsFooter"
    } 
  },],
  registry: [
    {
      route: "/supplierproducts",
      name: "supplierproducts",      
      template: "supplierProductsLanding",
      layout: "coreLayoutOlga",
      workflow: "coreProductGridWorkflow",
    }
  ]
});
