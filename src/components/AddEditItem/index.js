import React, { useState, useEffect } from "react";
import Creatable from "react-select/creatable"; // Correct import for Creatable
import { useParams, useNavigate } from "react-router-dom";
import "./index.css";

const AddEditItem = () => {
  const [item, setItem] = useState({
    itemName: "",
    dscription: "",
    itemType: "", // Initially empty
    quantity: "",
    price: "",
  });

  const [itemTypes, setItemTypes] = useState([]); // Array of item types
  const { id } = useParams(); // Get the id from the URL params
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch item types for the dropdown
    fetch("http://localhost:3000/item-types")
      .then((response) => response.json())
      .then((data) =>
        setItemTypes(
          data.map((itemType) => ({
            value: itemType._id, // Ensure this is the correct ObjectId
            label: itemType.typeDescription, // The label you want to display
          }))
        )
      )
      .catch((error) => {
        console.error("Error fetching item types:", error);
        alert("Error fetching item types.");
      });

    if (id) {
      // Fetch the item data if it's in edit mode
      fetch(`http://localhost:3000/items/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch item data.");
          }
          return response.json();
        })
        .then((data) => {
          // Ensure itemType is set as an object with value and label
          setItem({
            ...data,
            itemType: {
              value: data.itemType,  // Assuming data.itemType is the ObjectId
              label: data.itemTypeLabel,  // Assuming data.itemTypeLabel is the label
            },
          });
        })
        .catch((error) => {
          console.error("Error fetching item data:", error);
          alert("Error fetching item data.");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleItemTypeChange = (selectedOption) => {
    // Ensure selectedOption is an object with value and label
    setItem((prevItem) => ({
      ...prevItem,
      itemType: selectedOption, // Set itemType as the selected object
    }));
  };

  const handleCreateItemType = (inputValue) => {
    // Create a new option if it's not already in the list
    const newOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, "-"), // Generate a unique value
      label: inputValue, // Use the input as the label
    };

    // Optionally, send this new option to the backend to save it
    fetch("http://localhost:3000/item-types", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        typeDescription: inputValue,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("New item type created:", data);
        setItemTypes((prevTypes) => [...prevTypes, newOption]);
        setItem((prevItem) => ({
          ...prevItem,
          itemType: newOption,
        }));
      })
      .catch((error) => {
        console.error("Error creating item type:", error);
        alert("Error creating item type.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Item:", item);

    // Validation for required fields
    if (
      !item.itemName ||
      !item.dscription ||
      !item.itemType ||
      !item.quantity ||
      !item.price
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const method = id ? "PUT" : "POST"; // Use PUT for editing, POST for adding new
    const url = id
      ? `http://localhost:3000/items/${id}`
      : `http://localhost:3000/items`;

    // Prepare the item payload
    const updatedItem = {
      ...item,
      itemType: item.itemType.value, // Use the value from react-select
      quantity: Number(item.quantity),
      price: Number(item.price),
    };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem), // Send the updated item data
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorDetails) => {
            console.error("Error details from API:", errorDetails);
            throw new Error(
              `Failed to save item: ${response.status} ${response.statusText}, Details: ${JSON.stringify(
                errorDetails
              )}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Item saved successfully:", data);
        navigate("/items"); // Navigate back to the items list
      })
      .catch((error) => {
        console.error("Error saving item:", error);
        alert(`Error saving item: ${error.message}`);
      });
  };

  return (
    <div className="add-edit-item">
      <h1>{id ? "Edit Item" : "Add Item"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={item.itemName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="dscription"
            value={item.dscription}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Item Type:</label>
          <Creatable
            options={itemTypes}
            value={item.itemType} // Ensure the value is set here
            placeholder="Select or create an item type..."
            isSearchable={true}
            onChange={handleItemTypeChange} // Handle item type change
            onCreateOption={handleCreateItemType} // Handle creation of a new option
            className="select"
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={item.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="buttons">
          <button type="submit">Save Item</button>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/items")}
          >
            Back to List
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditItem;
