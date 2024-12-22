import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css"; // Import the CSS file

const ItemList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch("http://localhost:3000/items")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      fetch(`http://localhost:3000/items/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            fetchItems();
          } else {
            console.error("Failed to delete the item.");
          }
        })
        .catch((error) => console.error("Error deleting item:", error));
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-item/${id}`);
  };

  return (
    <div className="item-list">
      <div className="button-container">
        <h2>Item List</h2>
        <button className="back-btn" ><Link to="/" className="link-btn">Back</Link></button>
      </div>
      {items.length === 0 ? (
        <p>No items available</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id} className="item-item">
              <Link to={`/items/${item._id}`}>{item.itemName}</Link>
              <div className="item-actions">
                <button onClick={() => handleEdit(item._id)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;
