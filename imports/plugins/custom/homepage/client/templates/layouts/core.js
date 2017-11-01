import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Blaze from "meteor/gadicc:blaze-react-component";
import { Template } from "meteor/templating";
import { Components, registerComponent } from "@reactioncommerce/reaction-components";

class CoreLayoutOlga extends Component {
  static propTypes = {
    actionViewIsOpen: PropTypes.bool,
    data: PropTypes.object,
    structure: PropTypes.object
  }

  render() {
    const { layoutFooter, template } = this.props.structure || {};
    const pageClassName = classnames({
      "page": true,
      "show-settings": this.props.actionViewIsOpen
    });

    return (
      <div className={pageClassName} id="reactionAppContainer">
        <Components.NavBar />

        <Blaze template="cartDrawer" className="reaction-cart-drawer" />

        { Template[template] &&
        <main>
          <Blaze template={template} />
        </main>
        }

        { Template[layoutFooter] &&
        <Blaze template={layoutFooter} className="reaction-navigation-footer footer-default" />
        }
      </div>
    );
    // Poistettu <main>-tagin sisältä
    // <div className="rui olga">
    //   <div className="bkdebug"><em>{"Olga layout"}</em></div>
    //   <div className="bkdebug"><em>{"layoutHeader template:"}</em> {this.props.structure.layoutHeader}</div>
    //   <div className="bkdebug"><em>{"layoutFooter template:"}</em> {this.props.structure.layoutFooter}</div>
    //   <div className="bkdebug"><em>{"Main Template:"}</em> {this.props.structure.template}</div>
    // </div>
  }
}

// Register component for it to be usable
registerComponent("coreLayoutOlga", CoreLayoutOlga);

export default CoreLayoutOlga;
