import { Meteor } from 'meteor/meteor';
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Media } from "lib/collections";


class ProductImage extends Component {
  static propTypes = {
    item: PropTypes.object,
    styles: PropTypes.object
  }

    /**
   * Media - find media based on a product/variant
   * @param  {Object} item object containing a product and variant id
   * @return {Object|false} An object contianing the media or false
   */
  displayMedia = (product) => {
    const variantImage = Media.findOne({
      "metadata.variantId": product.variantId,
    });

    if (variantImage) {
      return variantImage;
    }
    

    const defaultImage = Media.findOne({
      "metadata.productId": product._id,
      "metadata.priority": 0
    });

    return defaultImage;
  }

  render() {
    const { item, styles } = this.props;
    var mediaUrl = "/resources/placeholder.gif";

    if (this.displayMedia(item)) {
      mediaUrl = this.displayMedia(item).url();
    }

    return (
      <div>
        <img
          alt={item.title}
          className="procuct-image"
          src={mediaUrl}
          style={styles}
        />
      </div>
    );
  }
}


function composer(props, onData) {
  Meteor.subscribe("Media");

  onData(null, {
    ...props });
}


registerComponent("ProductImage", ProductImage, composeWithTracker(composer));

export default composeWithTracker(composer)(ProductImage);