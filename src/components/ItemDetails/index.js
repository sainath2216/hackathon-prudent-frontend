import React, { useEffect, useState } from "react";
import { useParams, Link  } from "react-router-dom";
import './index.css';

const ItemDetails = () => {
  const { id } = useParams();  
  const [item, setItem] = useState(null);  
  const [error, setError] = useState(null);  

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`http://localhost:3000/items/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setItem(data);  
      } catch (error) {
        console.error("Error fetching item details:", error);
        setError(error.message);  
      }
    };

    fetchItem();
  }, [id]);  

  if (error) return <p className="error-message">Failed to load item details: {error}. Please try again later.</p>;
  if (!item) return <p className="loading-message">Loading...</p>;

  return (
    <div>
    <div className="item-details">
      <h2>{item.itemName}</h2>
      <p>
        <strong>Description:</strong> {item.dscription}
      </p>
      <p>
        <strong>Item Type:</strong> {item.itemType ? item.itemType.typeDescription : 'No item type available'}
      </p>
      <p>
        <strong>Quantity:</strong> {item.quantity}
      </p>
      <p>
        <strong>Price:</strong> ${item.price}
      </p>
    </div>
    <button className="back-btn"><Link to="/items" className="link-btn">Back</Link></button>
    </div>
  );
};

export default ItemDetails;
