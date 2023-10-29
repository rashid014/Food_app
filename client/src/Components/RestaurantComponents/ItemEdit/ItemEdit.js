// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define a functional component for editing an item
function EditItem() {
  const [item, setItem] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Function to fetch the item data from the server
  const fetchItemData = async (itemId) => {
    try {
      const response = await axios.get(`/items/${itemId}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error fetching item data:', error);
    }
  };

  // Function to update the item
  const updateItem = async () => {
    try {
      await axios.put(`/items/${item._id}`, item);
      setIsEditing(false); // Close the edit popup
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  useEffect(() => {
    // You should pass the actual item ID to fetchItemData
    const itemId = 'your_item_id_here';
    fetchItemData(itemId);
  }, []);

  return (
    <div>
      <button onClick={() => setIsEditing(true)}>Edit</button>

      {isEditing && (
        <div>
          <h2>Edit Item</h2>
          <label>Name: </label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
          />
          <br />

          <label>Price: </label>
          <input
            type="number"
            value={item.price}
            onChange={(e) => setItem({ ...item, price: e.target.value })}
          />
          <br />

          <label>Image URL: </label>
          <input
            type="text"
            value={item.image}
            onChange={(e) => setItem({ ...item, image: e.target.value })}
          />
          <br />

          <label>Type of Meal: </label>
          <input
            type="text"
            value={item.typeOfMeal}
            onChange={(e) => setItem({ ...item, typeOfMeal: e.target.value })}
          />
          <br />

          <label>Time Available: </label>
          <input
            type="text"
            value={item.timeAvailable}
            onChange={(e) => setItem({ ...item, timeAvailable: e.target.value })}
          />
          <br />

          <label>Category: </label>
          <input
            type="text"
            value={item.category}
            onChange={(e) => setItem({ ...item, category: e.target.value })}
          />
          <br />


          <br />

          <button onClick={updateItem}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default EditItem;
