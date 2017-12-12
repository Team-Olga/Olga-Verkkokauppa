import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Tooltip } from 'react-tippy';

import OverviewSearch from './overviewSearch';
import ProductSummaryList from './productSummaryList';
import DeliverySummaryList from './deliverySummaryList';
import { SideView } from '@olga/olga-ui';

import AlertContainer from "react-alert";
import 'react-tippy/dist/tippy.css';

import { VelocityTransitionGroup } from "velocity-react";
import 'velocity-animate';
import 'velocity-animate/velocity.ui';
import './styles.less';
import './table.less';


class OverviewDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      filterOpen: false,
      openList: "product",
      productClassName: "order-icon-toggle",
      deliveryClassName: "",
    };
  }

  handleSearchChange = (value) => {
    this.setState({ searchQuery: value });
  }

  toggleFilter = () => {
    this.setState({ filterOpen: !this.state.filterOpen });
  }

  handleListToggle = (selectedList) => {
    this.setState({
      productClassName: selectedList === "product" ? "order-icon-toggle" : "",
      deliveryClassName: selectedList === "delivery" ? "order-icon-toggle" : "",
      openList: selectedList
    });
  }

  handleSideViewClose = () => {
    this.setState({
      sideViewOpen: false
    });
  }

  setSideViewProps = (props) => {
    this.setState({
      sideViewOpen: true,
      sideViewProps: props
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

  resendPackingSlip = (deliveryId) => {
    Meteor.call(
      "deliveries/resendPackingSlip",
      deliveryId,
      (error, result) => {
        if(error) {
          this.showAlert("Lähetyslistaa ei pystytty lähettämään!", "error");
        } else {
          this.showAlert("Lähetyslista lähetetty sähköpostilla", "success");
        }
      }
    )
  }

  render() {
    return (
      <div className="supplier-overview-container">
        <VelocityTransitionGroup
          enter={{animation: "transition.slideLeftIn", delay:10, duration: 400, easing: "ease-in-out"}}
          leave={{animation: "transition.slideLeftOut", duration: 600, easing: "ease-in-out"}}
          runOnMount={true}
        >
        {this.state.sideViewOpen ? 
          <SideView 
            {...this.state.sideViewProps}
            handleSideViewClose={this.handleSideViewClose} />
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

        <div className="order-toggle-buttons-container">
            <div className="order-toggle-buttons">

              <Tooltip
                title="Tuotteet"
                position="top"
                delay="500"
                arrow="true"
              >
                <button
                  className={`order-toggle-btn ${this.state.productClassName}`}
                  onClick={() => this.handleListToggle("product")}
                >
                  <i className="fa fa-list" />
                </button>
              </Tooltip>

              <Tooltip
                title="Toimitukset"
                position="top"
                delay="500"
                arrow="true"
              >
                <button
                  className={`order-toggle-btn ${this.state.deliveryClassName}`}
                  onClick={() => this.handleListToggle("delivery")}
                >
                  <i className="fa fa-cubes" />
                </button>
              </Tooltip>
            </div>
          </div>

        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

        {this.state.openList === "product" &&
        <ProductSummaryList
          searchQuery={this.state.searchQuery}
          filterOpen={this.state.filterOpen}
          setSideViewProps={this.setSideViewProps}
          closeSideView={this.handleSideViewClose}
          showAlert={this.showAlert}
        />}

        {this.state.openList === "delivery" &&
        <DeliverySummaryList
          searchQuery={this.state.searchQuery}
          resendPackingSlip={this.resendPackingSlip}
        />}

      </div>
    );
  }
}

/*OverviewDashboard.propTypes = {
  productOverviews: PropTypes.arrayOf(PropTypes.object),
}
*/
function composer(props, onData) {
  Meteor.subscribe("ContractTotals");

  onData(null, {
    ...props });
}


registerComponent("OverviewDashboard", OverviewDashboard, composeWithTracker(composer));

export default composeWithTracker(composer)(OverviewDashboard);