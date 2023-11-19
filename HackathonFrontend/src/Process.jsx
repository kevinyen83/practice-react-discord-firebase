import NavSection from "./components/NavSection";
import "./Process.css";
import pizzaGif from "./components/img/pizza-load.gif";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Process() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const middlemanPageURL = "/middlemanHomePage";
      window.open(middlemanPageURL, "_blank");
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="container">
        <div
          className="row"
          style={{ marginBottom: "46px", marginTop: "29px" }}
        >
          <NavSection />
        </div>
        <div className="row processing-container">
          <img
            style={{
              marginBottom: "30px",
              marginTop: "140px",
              width: "15%",
            }}
            src={pizzaGif}
            alt=""
          />

          <Link to="/call" className="processing-title">
            Processing Order
          </Link>
          <div className="processing-desc">
            Hold on while we process your order
          </div>
        </div>
      </div>
    </>
  );
}

export default Process;