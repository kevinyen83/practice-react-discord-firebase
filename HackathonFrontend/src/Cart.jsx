import CartPopup from "./components/CartPopup";
import NavSection from "./components/NavSection";

function Cart() {
  return (
    <div className="container">
      <div className="row" style={{ marginBottom: "46px", marginTop: "29px" }}>
        <NavSection />
      </div>
      <CartPopup />
    </div>
  );
}

export default Cart;
