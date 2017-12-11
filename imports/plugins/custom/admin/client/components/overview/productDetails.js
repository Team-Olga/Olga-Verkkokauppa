import React, { Component } from "react";
import PropTypes from "prop-types";
import { Badge } from "@reactioncommerce/reaction-ui";

import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

import { VelocityTransitionGroup, VelocityComponent } from "velocity-react";
import 'velocity-animate';
import 'velocity-animate/velocity.ui';

import ProductImage from './productImage';

class ProductDetails extends Component {
  static propTypes = {
    product: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      productionTime: this.props.product.productionTime,
      newProductionTime: this.props.product.productionTime || 0
    };
  }

  toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode
    });
  }

  updateProductionTime() {
    if (Number(this.state.newProductionTime) >= 0) {
      console.log("Setting production time:")
      console.log(this.state.newProductionTime)

      Meteor.call('product/settings/setProductionTime', 
        this.props.product.simpleId,
        Number(this.state.newProductionTime),
      (err, res) => {
        if (err) {
          alert(err);
        } else {
          this.setState( {
            productionTime: this.state.newProductionTime,
            editMode: false
          });
        }
      });
    }
  }

  render() {
    const { product } = this.props;

    let styles = {
      border: 'none',
      borderBottom: '1px solid #738690',
      background: 'transparent',
      borderRadius: '0px',
      margin: '0px',
      padding: '0px',
      textAlign: 'center',
      width: '0px',
      opacity: '0',
      outline: 'none'
    }
    
    return (
      <div className="product-details">

        <div className="product-info" style={{ marginTop: 4 }}>
          <h3>{product.simpleTitle}</h3>
          <ProductImage 
            displayMedia={this.props.displayMedia} 
            item={this.props.product}
            styles={{maxWidth: '50%'}}/>
        </div>

        <div className={"product-settings-container" + (this.state.editMode ? "-edit" : "")}>
          <div className="edit-mode-icon-container"
            onClick={() => this.toggleEditMode()}> 
            <i className={
              this.state.editMode ? 
              "fa fa-close" : "fa fa-pencil-square-o"}>
            </i>
          </div>
          <div className="edit-container">

            <div className="production-time-container"> 
              <div className="production-time-label"> 
                Tuotantoaika: 
              </div>

              <div className="production-time-value" 
                   style={{textAlign: "right"}}>
                {this.state.editMode ? (
                <div>
                <Tooltip
                title="Asettaminen nollaksi poistaa tuotantoajan tuotteelta"
                position="top"
                trigger="click"
                animateFill={true}
                delay="400"
                size="big"
                arrow="true">
                  <VelocityComponent animation={{ width: '50px', opacity: 1 }} duration={500} runOnMount={true}>
                    <input
                      style={styles}
                      type={"number"}
                      onChange={e => {
                        const value = e.target.value;
                        return this.setState({ newProductionTime: value });
                      }}
                      value={this.state.newProductionTime}
                    />
                  </VelocityComponent>
                </Tooltip>

                <span style={{marginLeft: '10px'}}> päivää</span>
                </div>
                )
                :
                ( (this.state.productionTime) ? 
                    (<span>{Math.trunc(this.state.productionTime / 7)} viikkoa, 
                          {this.state.productionTime % 7} päivää</span>) : 
                    <span>Ei asetettu</span>)
                }
              </div>
            </div>
          </div>
        </div>
        <button 
          className={"accept-button" + (this.state.editMode ? "" : "-none" )}
          onClick={() => this.updateProductionTime()}>
          Hyväksy
        </button> 
      </div>

    );
  }
}

export default ProductDetails;