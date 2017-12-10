import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Tooltip } from 'react-tippy';

import OverviewSearch from './overviewSearch';
import ProductOverviewList from './productOverviewList';
import SideView from './sideView';

import AlertContainer from "react-alert";
import 'react-tippy/dist/tippy.css';

import { VelocityTransitionGroup } from "velocity-react";
import 'velocity-animate';
import 'velocity-animate/velocity.ui';


class OverviewDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      filterOpen: false
    };
  }

  handleSearchChange = (value) => {
    this.setState({ searchQuery: value });
  }

  toggleFilter = () => {
    this.setState({ filterOpen: !this.state.filterOpen });
  }

  handleSideViewClose = () => {
    this.setState({
      sideViewOpen: false
    });
  }

  setSideView = (component) => {
    this.setState({
      sideViewOpen: true,
      sideViewContent: component
    })
  }

  alertOptions = {
    offset: 14,
    position: "top left",
    theme: "light",
    time: 5000,
    transition: "scale"
  }

  showAlert = (message, type) => {
    this.msg.show(message, {
      time: 5000,
      type: type
    });
  }

  render() {
    return (
      <div className="supplier-overview-container">
        <VelocityTransitionGroup
          enter={{animation: "transition.slideRightIn", delay:10, duration: 400, easing: "ease-in-out"}}
          leave={{animation: "transition.slideRightOut", duration: 600, easing: "ease-in-out"}}
          runOnMount={true}
        >
        {this.state.sideViewOpen ? 
          <SideView 
            content={this.state.sideViewContent} 
            handleSideViewClose={this.handleSideViewClose} />
/*          SideView = (props) => ({})
            content={this.props.sideViewContent} 
            handleSideViewClose={this.handleSideViewClose} />*/
          :
          undefined
        }
        </VelocityTransitionGroup>
        <div className="overview-toolbar">
          <div className="overview-toolbar-item" style={{ width:'100%' }}>
            <OverviewSearch
              handleChange={this.handleSearchChange}
            />
          </div>
          <div className="overview-toolbar-item" style={{ width:'40px'}}>
            <div className="toggle-open-orders">
              <Tooltip
              title="Suodata avoimet tilaukset"
              position="top"
              delay="500"
              arrow="true"
              >
              <input type="checkbox" value="1" id="checkboxOneInput" name="" onClick={this.toggleFilter.bind(this)}/>
              <label htmlFor="checkboxOneInput"></label>
              </Tooltip>
            </div>
          </div>
        </div>

        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

        <ProductOverviewList
          searchQuery={this.state.searchQuery}
          filterOpen={this.state.filterOpen}
          setSideViewContent={this.setSideView}
          closeSideView={this.handleSideViewClose}
          showAlert={this.showAlert}
        />
      </div>
    );
  }
}

/*OverviewDashboard.propTypes = {
  productOverviews: PropTypes.arrayOf(PropTypes.object),
}
*/
function composer(props, onData) {

  onData(null, {
    ...props });
}


registerComponent("OverviewDashboard", OverviewDashboard, composeWithTracker(composer));

export default composeWithTracker(composer)(OverviewDashboard);