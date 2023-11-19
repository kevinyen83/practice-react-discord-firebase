import React, { Component } from "react";
import "./ProductCard.css";

import { Link } from "react-router-dom";

function ProductCard(props) {
  return (
    <>
      <div className="col-12 col-xl-3 col-lg-3 col-md-4 col-sm-12">
        <div className="product-card">
          <img src={props.image} className="product-image" />
          <div className="product-card-details">
            <div className="pizza-information">
              <div className="info-title">{props.title}</div>
              <div className="info-price">{props.price}</div>
            </div>
            <div className="pizza-rating">{props.rating}</div>
          </div>
          <Link to="/cart" class="order-button">
            Add to order
          </Link>
        </div>
      </div>
    </>
  );
}

export default ProductCard;