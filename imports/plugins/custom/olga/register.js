import { Reaction } from "/server/api";
import "./server/methods";
import "./server/hooks";
import packingSlipHTML from "./lib/templates/packing-slip";

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
/*    {
      route: "/supplierproducts",
      name: "supplierproducts",
      layout: "coreLayoutOlga",
      template: "supplierProductsLanding",
      workflow: "coreProductGridWorkflow"
    },*//*
    {
      route: "/supplierproductsreact",
      name: "supplierproductsreact",
      label: "Supplierproducts",
      provides: ["supplierAccountDropdown"],
      icon: "fa fa-telegram",
      layout: "coreLayoutOlga",
      template: "supplierProductsReact",
      workflow: "coreProductGridWorkflow"
    },*/
/*    {
      route: "/contracts",
      name: "contracts",
      label: "Supply contracts",
      provides: ["supplierAccountDropdown"],
      icon: "fa fa-telegram",
      layout: "coreLayoutOlga",
      template: "contractList",
      workflow: "coreProductGridWorkflow"
    },*/
    {
      route: "/about",
      name: "about",
      layout: "coreLayoutOlga",
      template: "aboutUs",
      workflow: "coreProductGridWorkflow"
    },
    {
      route: "/",
      name: "index",
      layout: "coreLayoutOlga",
      template: "homepageReact",
      workflow: "coreProductGridWorkflow"
    }

  ]
});

Reaction.registerTemplate({
  title: "Delivery packing slip",
  name: "deliveries/packing-slip",
  type: "email",
  template: packingSlipHTML(),
  subject: "Toimituksen lähetyslista"
});