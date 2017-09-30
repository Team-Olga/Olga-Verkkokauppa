import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardHeader, CardBody, CardGroup, TextField } from "/imports/plugins/core/ui/client/components";

class SupplierProductsListItem extends Component {
    constructor(props) {
        super(props);
    }

    orderCount() {
        return 2;
    }

    orderQuantity() {
        return 13;
    }

    openOrderQuantity() {
        return 7;
    }

    render() {
        return(
            <Card
                expanded={true}
            >
                <CardHeader
                    title={product.title}
                >
                </CardHeader>
                <CardBody>
                    <Button
                        bezelStyle="solid"
                        status="primary"
                        className="pull-right"
                    >
                        Tilauksia {this.orderCount}
                    </Button>
                    <Button
                        bezelStyle="solid"
                        status="primary"
                        className="pull-right"
                    >
                        Tilattu {this.orderQuantity}
                    </Button>
                    <Button
                        bezelStyle="solid"
                        status="primary"
                        className="pull-right"
                    >
                        Avoinna {this.openOrderQuantity}
                    </Button>
                </CardBody>
            </Card>
        );
    }
}

SupplierProductsListItem.propTypes = {
    product: PropTypes.object
};

export default SupplierProductsListItem;