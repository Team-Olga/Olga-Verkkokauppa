import { Reaction } from 'server/api';

Reaction.registerPackage({
  label: "Homepage",
  name: "homepage",
  icon: "fa fa-home",
  autoenable: true,
  registry: [
    {
      route: "/home",
      name: "homepage",
      layout: "coreLayoutOlga",
      template: "homepageReact",
      workflow: "coreWorkflow"
    }
  ]
})
