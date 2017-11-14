import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import ContractListItem from "./contractListItem";

class ContractList extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const contractColumns = [
            {
                Header: "",
                accessor: "productName",
                Cell: cellInfo => (
                    <ContractListItem
                        contract={cellInfo.original}
                        userStatus={this.props.userStatus}
                    />
                )
            }
        ];

        return (
            <div>
                <ReactTable
                    data={this.props.contracts}
                    columns={contractColumns}
                    defaultPageSize={10}
                    className="olga-list-table"
                />
            </div>
        );
    }    
}

ContractList.propTypes = {
    contracts: PropTypes.arrayOf(PropTypes.object),
    userStatus: PropTypes.string
}

export default ContractList;