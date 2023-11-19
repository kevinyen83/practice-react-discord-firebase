import "./CallCardIncoming.css";
import answerIcon from "./img/answer.svg";
import declineIcon from "./img/decline.svg";

import { Link } from "react-router-dom";

function CallCardIncoming() {
    
    const handleButtonClick = () => {
        // Open the first page in a new tab
        window.open("https://safe-order.netlify.app/conference?id=safe-order%7C1688432269330", "_blank");
        
        // Navigate to the second page in the current tab
        window.location.href = "/answer";
      };

  return (
    <>
      <div className="call-card-container">
        <div className="call-card-image">P</div>
        <div className="call-card-title">Pizza Eats</div>
        <div className="call-card-subtitle">Incoming Call</div>
        <div className="call-card-action">
          <Link onClick={handleButtonClick} className="call-button">
            <img src={answerIcon} alt="" />
          </Link>
          <Link to="/browse" className="call-button">
            <img src={declineIcon} alt="" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default CallCardIncoming;
