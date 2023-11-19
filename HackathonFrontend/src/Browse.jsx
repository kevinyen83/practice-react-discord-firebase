import NavSection from "./components/NavSection";
import ProductCard from "./components/ProductCard";
import TitleSection from "./components/TitleSection";

function Browse() {
  const pizzaData = [
    {
      pizza: "Pepperoni Pizza",
      price: "$29.00 • 10-25 min",
      rating: "2.5",
      image: "./src/components/img/pepperoni.jpg",
    },
    {
      pizza: "Margherita Pizza",
      price: "$25.00 • 10-20 min",
      rating: "4.0",
      image: "./src/components/img/margherita.jpg",
    },
    {
      pizza: "Hawaiian Pizza",
      price: "$27.50 • 15-30 min",
      rating: "3.8",
      image: "./src/components/img/hawaiian.jpg",
    },
    {
      pizza: "Vegetarian Pizza",
      price: "$26.00 • 12-22 min",
      rating: "4.2",
      image: "./src/components/img/vegetarian.jpg",
    },
    {
      pizza: "BBQ Chicken Pizza",
      price: "$30.00 • 15-25 min",
      rating: "4.5",
      image: "./src/components/img/pizza.jpg",
    },
    {
      pizza: "Mushroom Pizza",
      price: "$24.50 • 10-20 min",
      rating: "3.9",
      image: "./src/components/img/mushroom.jpg",
    },
    {
      pizza: "Supreme Pizza",
      price: "$31.00 • 12-25 min",
      rating: "4.7",
      image: "./src/components/img/supreme.jpg",
    },
  ];

  const pizzaItems = pizzaData.map((pizza) => (
    <ProductCard
      title={pizza.pizza}
      price={pizza.price}
      rating={pizza.rating}
      image={pizza.image}
    />
  ));

  return (
    <>
      <div className="container">
        <div
          className="row"
          style={{ marginBottom: "46px", marginTop: "29px" }}
        >
          <NavSection />
        </div>
        {/* <CartPopup /> */}
        <div className="row my-4" style={{ marginBottom: "29px" }}>
          <TitleSection />
        </div>
        <div className="row">{pizzaItems}</div>
      </div>
    </>
  );
}

export default Browse;