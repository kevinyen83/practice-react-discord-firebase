import NavSection from "./components/NavSection";

import CallCardAnswered from "./components/CallCardAnswered";

function Answer() {
  return (
    <>
      <div className="container">
        <div
          className="row"
          style={{ marginBottom: "46px", marginTop: "29px" }}
        >
          <NavSection />
        </div>
        <CallCardAnswered />
      </div>
    </>
  );
}

export default Answer;
