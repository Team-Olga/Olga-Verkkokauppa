import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Media } from "/lib/collections";
import { composeWithTracker } from "@reactioncommerce/reaction-components";

// Task component - represents a single todo item
class ProductItem extends Component {
  media() {
    const media = Media.findOne({
      "metadata.productId": this.props.product._id,
      "metadata.toGrid": 1
    }, {
      sort: { "metadata.priority": 1, "uploadedAt": 1 }
    });

    return media instanceof FS.File ? media : false;
  }

  renderMedia() {
    let imgStyle = {
      display: "block",
      //object-fit: "cover",
      width: "124px",
      height: "124px",
      backgroundSize: "cover",
      backgroundPosition: "center center",
    };

    if (this.media() === false) {
      //imgStyle.backgroundImage = "url('/resources/placeholder.gif')";
      return (
        <span className="product-image" style={{ backgroundImage: "url('/resources/placeholder.gif')", ...imgStyle }} />
      );
    }
    return (
      //imgStyle.backgroundImage = `url(${this.media().url({ store: "large" })})`;
      <span className="product-image" style={{ backgroundImage: `url(${this.media().url({ store: "large" })})`, ...imgStyle }}/>
    );
  }
 
  render() {

    return (
      <div className="supplier-product" styles={{margin: "10px"}}>
        {this.renderMedia()}
        <div className="overlay">
          <div className="overlay-title" style={{maxWidth: "124px"}}>{this.props.product.title}</div>
        </div>
      </div>
    );
  }
}

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

function composer(props, onData) {
  const pkg = Meteor.subscribe("Media");

  if (pkg.ready()) {
    onData(null, { ...props });
  }
}

export default composeWithTracker(composer)(ProductItem);