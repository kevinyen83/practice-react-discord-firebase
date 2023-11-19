import React, { Component } from "react";
import pizzaIcon from "./img/pizza-icon.svg";
import "./TitleSection.css";

function TitleSection() {
  return (
    <>
      <div className="title-section-container">
        <div className="section-container">
          <img src={pizzaIcon} alt="" />
          <div className="section-title">Top Recommendations</div>
        </div>
        <div className="result-container">Showing 12,000 Results</div>
      </div>
    </>
  );
}

export default TitleSection;
