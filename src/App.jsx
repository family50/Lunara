import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Select from "./Select/select.jsx";
import Home from "./home/home.jsx";
import HomeAllProducts from "./all-products/home-all-products.jsx";
import Payment from "./home/payment.jsx"; // المسار الخاص بملفك

export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Select />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<HomeAllProducts />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
    
  );
}
