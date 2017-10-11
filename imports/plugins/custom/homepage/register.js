import { Reaction } from 'server/api';

Reaction.registerPackage({
  label: "Homepage",
  name: "homepage",
  icon: "fa fa-home",
  autoenable: true,
  layout: [{
    layout: "coreLayoutOlga",
    workflow: "coreProductGridWorkflow",
    theme: "default",
    enabled: true
  }],
  registry: [
    {
      route: "/home",
      name: "home",
      layout: "coreLayoutOlga",
      template: "homepageReact",
      workflow: "coreProductGridWorkflow"
    }
  ]
});
