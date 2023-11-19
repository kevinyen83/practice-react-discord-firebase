import "./CallCardAnswered.css";
import declineIcon from "./img/decline.svg";
import speakerIcon from "./img/speaker.svg";
import pauseIcon from "./img/pause.svg";
import muteIcon from "./img/mute.svg";

import { Link } from "react-router-dom";

function CallCardAnswered() {
    
  return (
    <>
      <div className="call-card-container">
        <div className="call-card-image">P</div>
        <div className="call-card-title">Pizza Eats</div>
        <div className="call-card-subtitle">0:12</div>
        <div className="call-card-options">
          <div className="call-card-options-item">
            <button className="options-item-icon">
              <img src={speakerIcon} alt="" />
            </button>
            <div className="options-item-text">Speaker</div>
          </div>
          <div className="call-card-options-item">
            <button className="options-item-icon">
              <img src={pauseIcon} alt="" />
            </button>
            <div className="options-item-text">Pause</div>
          </div>
          <div className="call-card-options-item">
            <button className="options-item-icon">
              <img src={muteIcon} alt="" />
            </button>
            <div className="options-item-text">Mute</div>
          </div>
        </div>
        <div className="call-card-action">
          <Link to="/" className="call-button">
            <img src={declineIcon} alt="" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default CallCardAnswered;
