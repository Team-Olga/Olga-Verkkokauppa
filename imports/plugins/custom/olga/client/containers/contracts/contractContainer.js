import React, { Component } from "react";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import _ from "lodash";
import { isInRole, getAllRoles } from "../../../lib/userChecks";
import { SupplyContracts } from "../../../lib/collections";
import { Loading } from "/imports/plugins/core/ui/client/components";


class ContractContainer extends Component {
    static propTypes = {
        contracts: PropTypes.array
    }

    constructor(props) {
        super(props);
    }

    render() {
        if(_.isEmpty(this.props.contracts)) {
            return  (
                <div>
                    <p>Toimitussopimuksia ei löytynyt!</p>
                </div>
            );
        }

        let userStatus;
        if (isInRole("admin")) {
          userStatus = "admin";
        } else if (isInRole("supplierproductsreact")) {
          userStatus = "supplier";
        }

        return (
            <div>
                Toimitussopimuslista!
            </div>
        );
    }

}

const loadData = (props, onData) => {
    const contractSubscription = Meteor.subscribe("SupplyContracts");

    if(contractSubscription.ready()) {
        const allContracts = SupplyContracts.find({}, { sort: { createdAt: 1 } }).fetch();

        onData(null, {
            contracts: allContracts
        });
    }
};

export default composeWithTracker(loadData, Loading)(ContractContainer);