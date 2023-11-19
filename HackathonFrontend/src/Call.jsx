import NavSection from "./components/NavSection";
import CallCardIncoming from "./components/CallCardIncoming";

function Call() {
  return (
    <>
      <div className="container">
        <div
          className="row"
          style={{ marginBottom: "46px", marginTop: "29px" }}
        >
          <NavSection />
        </div>
        <CallCardIncoming />
      </div>
    </>
  );
}

export default Call;
