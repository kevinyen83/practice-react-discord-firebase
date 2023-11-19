import React, { Component } from "react";
import websiteLogo from "./img/logo.svg";
import locationIcon from "./img/location.svg";
import chevronIcon from "./img/chevron.svg";
import phoneIcon from "./img/phone.svg";

import { Link } from "react-router-dom";

import "./NavSection.css";

function NavSection() {
  return (
    <>
      <div className="navigation-container">
        <div className="left-navigation">
          <Link
            to="/browse"
            className="d-flex justify-content-center align-items-center"
          >
            <img src={websiteLogo} alt="" />
          </Link>
          <button className="filter-button">
            <div className="filter-button-section">
              <img src={locationIcon} alt="" />
              Ultimo
            </div>

            <img src={chevronIcon} alt="" />
          </button>
          <button className="search-button d-none d-xl-block d-lg-block">
            Search Items
          </button>
        </div>
        <div className="right-navigation">
          <Link to="/cart" className="cart-button d-none d-xl-flex d-lg-flex">
            View Cart
          </Link>
          <Link to="/call" className="phone-button">
            <img src={phoneIcon} alt="" />
            Place Phone Order
          </Link>
        </div>
      </div>
    </>
  );
}

export default NavSection;
