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
      borderLeft: "1px solid #98afbc",
      width: "400px",
      top: "0",
      right: "65px",
      position: "absolute",
      zIndex: "1050",
      background: "white",
      height: "100%",
      boxShadow: "0 0 400px 400px rgba(0, 0, 0, 0.02)"
    };

    console.log("content");
    console.dir(this.props.content);

    return (
      <div className="side-view" style={styles}>
        <div className="side-view-header" style={{margin: "5px"}}>
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