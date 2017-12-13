import _ from 'lodash';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconButton } from "/imports/plugins/core/ui/client/components";


class SideView extends Component {
  static propTypes = {
    title: PropTypes.string,
    styles: PropTypes.object,
    content: PropTypes.object,
    handleSideViewClose: PropTypes.func
  }

  renderBackButton() {
    var backButton = { height: "100%", margin: "9px" };
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
    var styles = {
      borderLeft: "1px solid #98afbc",
      width: "400px",
      top: "0",
      right: "0px",
      position: "absolute",
      zIndex: "1050",
      background: "white",
      height: "100%",
      boxShadow: "0 0 400px 400px rgba(0, 0, 0, 0.02)"
    };

    var titleStyles = {
      fontSize: "22px",
      color: "#1999dd",
      margin: "5px",
      marginLeft: "10px"
    }

    if (this.props.styles) {
      styles = _.defaults(this.props.styles, styles);
    }

    console.log("content");
    console.dir(this.props.content);

    return (
      <div className="side-view" style={styles}>
        <div className="side-view-header" 
             style={{
               borderBottom: "3px solid rgba(152, 175, 188, 0.3)",
               display: "flex"
             }}>
          {this.renderBackButton()}
          <div className="title-container" style={titleStyles}>
            {this.props.title}
          </div>
        </div> 
        <div className="side-view-content">
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default SideView;