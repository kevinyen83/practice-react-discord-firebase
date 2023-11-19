import React, { Component } from "react";
import "./CartPopup.css";
import crossIcon from "./img/cross.svg";
import chevronIcon from "./img/chevron.svg";

import { Link } from "react-router-dom";

function CartPopup() {
  return (
    <>
      <div className="popup-container">
        <img src={crossIcon} className="cart-close-icon" alt="" />
        <div className="cart-title">Your Cart</div>
        <div className="item-container">
          <div className="item-container-title">
            <div className="quantity-container">
              1<img src={chevronIcon} alt="" />
            </div>
            <div className="item-title-text">Pepperoni Pizza</div>
          </div>
          <div className="item-price-text">$25.00</div>
        </div>
        <Link
          to="/checkout"
          className="checkout-button d-flex justify-content-center align-items-center"
        >
          Go to checkout • $25.00{" "}
        </Link>
      </div>
    </>
  );
}

export default CartPopup;
