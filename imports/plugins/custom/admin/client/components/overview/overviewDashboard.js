import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import OverviewSearch from './overviewSearch';
import ProductSummaryList from './productSummaryList';
import SupplierSummaryList from './supplierSummaryList';
import SideView from './sideView';
import { Tooltip } from 'react-tippy';

import { VelocityTransitionGroup } from "velocity-react";
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import 'react-tippy/dist/tippy.css';


class AdminOverviewDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      filterOpen: false,
      listClassName: "order-icon-toggle",
      openList: true,
      sideViewOpen: false,
      sideViewContent: undefined
    };
  }

  handleSearchChange = (value) => {
    this.setState({ searchQuery: value });
  }

  toggleFilter = () => {
    this.setState({ filterOpen: !this.state.filterOpen });
  }

  handleListToggle = () => {
    this.setState({
      detailClassName: "",
      listClassName: "order-icon-toggle",
      openList: true
    });
  }

  handleDetailToggle = () => {
    this.setState({
      detailClassName: "order-icon-toggle",
      listClassName: "",
      openList: false
    });
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
            content={this.props.sideViewContent}
            handleSideViewClose={this.handleSideViewClose} />
          :
          undefined
        }
        </VelocityTransitionGroup>
        <div>
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

          <div className="order-toggle-buttons-container">
            <div className="order-toggle-buttons">

            <Tooltip
            title="Tavarantoimittajat"
            position="top"
            delay="500"
            arrow="true"
            >
              <button
                className={`order-toggle-btn ${this.state.detailClassName}`}
                onClick={this.handleDetailToggle}
              >
                <i className="fa fa-th-list" />
              </button>
              </Tooltip>

              <Tooltip
              title="Tuotteet"
              position="top"
              delay="500"
              arrow="true"
              >
              <button
                className={`order-toggle-btn ${this.state.listClassName}`}
                onClick={this.handleListToggle}
              >
                <i className="fa fa-list" />
              </button>
              </Tooltip>
            </div>
          </div>

          {this.state.openList ?
            <ProductSummaryList
            searchQuery={this.state.searchQuery}
            filterOpen={this.state.filterOpen}
            />
            :
            <SupplierSummaryList
            searchQuery={this.state.searchQuery}
            />
          }
        </div>
      </div>
    );
  }
}

/*AdminOverviewDashboard.propTypes = {
  productOverviews: PropTypes.arrayOf(PropTypes.object),
}
*/
function composer(props, onData) {

  onData(null, {
    ...props });
}


registerComponent("AdminOverviewDashboard", AdminOverviewDashboard, composeWithTracker(composer));

export default composeWithTracker(composer)(AdminOverviewDashboard);
