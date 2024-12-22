import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";

const Home = () => {
  const [items, setItems] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("");  
  const [filteredItems, setFilteredItems] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);  
  const itemsPerPage = 5;  

  useEffect(() => {
    fetch("http://localhost:3000/items")  
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  
  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, items]);

  const indexOfLastItem = currentPage * itemsPerPage;  
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;  
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);  

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);  

  // Handle page changes (previous, next, specific page)
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="home-container">
      <div className="main-heading">
        <h1>Welcome to the Item Management System</h1>
        <p className="description">
          Search, view, and manage your items efficiently.
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for an item by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}  // Update search term as user types
          className="search-input"
        />
      </div>

      {/* Item List */}
      <div className="item-list-container">
        {currentItems.length > 0 ? (
          <ul className="item-list">
            {currentItems.map((item) => (
              <li key={item._id} className="item-item">
                <Link to={`/items/${item._id}`}>
                  <h3 className="title">Item: {item.itemName}</h3>
                  <p>Description: {item.dscription}</p>
                  
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="not-found">
            <p>No items found.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
