import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ItemDetails from "./components/ItemDetails";
import AddEditItem from "./components/AddEditItem";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import About from "./components/About";
import ItemList from './components/ItemList';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/add-item" element={<AddEditItem />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/edit-item/:id" element={<AddEditItem />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
