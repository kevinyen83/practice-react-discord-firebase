import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Checkout from "./Checkout";
import Process from "./Process";
import Home from "./Home";
import Browse from "./Browse";
import Call from "./Call";
import Answer from "./Answer";
import Cart from "./Cart";
import MiddlemanHomePage from './components/MiddlemanHomePage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="process" element={<Process />} />
          <Route path="call" element={<Call />} />
          <Route path="answer" element={<Answer />} />
          <Route path="cart" element={<Cart />} />
          <Route path="middlemanHomePage" element={<MiddlemanHomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
