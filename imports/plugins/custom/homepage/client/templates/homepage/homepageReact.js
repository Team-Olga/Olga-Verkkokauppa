import { Template } from "meteor/templating";
import HomepageContainer from "../../containers/homepage/homepageContainer";

Template.homepageReact.helpers({
  HomepageContainer() {
    return HomepageContainer;
  }
});
