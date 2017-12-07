import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Tooltip } from 'react-tippy';

import OverviewSearch from './overviewSearch';
import ProductOverviewList from './productOverviewList';

import 'react-tippy/dist/tippy.css';


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

  render() {
    return (
      <div className="supplier-overview-container">
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

        <ProductOverviewList
          searchQuery={this.state.searchQuery}
          filterOpen={this.state.filterOpen}
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
