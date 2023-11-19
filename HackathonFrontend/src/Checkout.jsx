import NavSection from "./components/NavSection";
import locationIcon from "./components/img/location.svg";
import "./Checkout.css";
import chevronIcon from "./components/img/chevron.svg";

import { Link } from "react-router-dom";

function Checkout() {
  return (
    <>
      <div className="container">
        <div
          className="row"
          style={{ marginBottom: "46px", marginTop: "29px" }}
        >
          <NavSection />
        </div>

        <div className="checkout-container">
          <div className="checkout-title">Order Checkout</div>
          <div className="checkout-type">
            <button class="leave-door-button">Leave At Door</button>
            <button class="hand-item-button">Hand Delivery</button>
          </div>
          <div className="checkout-address">
            <div className="checkout-address-left">
              <img src={locationIcon} className="location-icon" alt="" />
              <div className="address-container">
                <div className="address-customer-name">Guest User</div>
                <div className="address-line-1">37 Ultimo Rd</div>
                <div className="address-line-2">Haymarket, NSW 2007</div>
                <div className="phone-number">+61 0411 123 456</div>
              </div>
            </div>
            <div className="checkout-address-right">
              <button className="edit-button">Edit Info</button>
            </div>
          </div>
          <div className="checkout-items">
            <div className="checkout-items-title">Item List</div>
            <div className="item-container">
              <div className="item-container-title">
                <div className="quantity-container">
                  1<img src={chevronIcon} alt="" />
                </div>
                <div className="item-title-text">Pepperoni Pizza</div>
              </div>
              <div className="item-price-text">$25.00</div>
            </div>
          </div>
          <Link to="/process" className="order-checkout-button">
            Place Order
          </Link>
        </div>
      </div>
    </>
  );
}

export default Checkout;
