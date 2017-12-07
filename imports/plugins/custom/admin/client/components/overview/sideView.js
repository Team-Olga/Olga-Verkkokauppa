import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconButton } from "/imports/plugins/core/ui/client/components";


class SideView extends Component {
  static propTypes = {
    content: PropTypes.object,
    handleSideViewClose: PropTypes.func
  }

  renderBackButton() {
    var backButton = { height: "100%" };
    var backButtonContainers = {
      display: "flex",
      alignItems: "center",
      height: "100%"
    };

    return (
      <div style={backButton}>
        <div style={backButtonContainers}>
          <IconButton
            bezelStyle={"flat"}
            icon="fa fa-times"
            onClick={this.props.handleSideViewClose}
          />
        </div>
      </div>
    );
  }

  render() {
    const styles = {
      width: "400px",
      border: "2px solid #1999dd",
      top: "0",
      right: "65px",
      position: "absolute",
      zIndex: "1050",
      background: "white",
      opacity: "0.5",
      height: "100%"
    };

    return (
      <div className="side-view" style={styles}>
        <div className="side-view-header">
          {this.renderBackButton()}
        </div> 
        <div className="side-view-content">
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default SideView;