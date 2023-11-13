import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RestaurantMenuEdit.css'
import axiosInstance from '../../../utils/axiosInstance'

const EditAndDeletePage = ({ type, id }) => {
  const [data, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/api/${type}/${id}`);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const handleEdit = async () => {
    try {
      // Implement your edit logic here
      // Use data from the 'data' state to update the category or item
      // Example: Update the category name
      await axiosInstance.put(`/api/${type}/${id}`, {
        name: data.name,
        // Include other properties for editing
      });

      // Navigate back to the categories or items page after editing
      navigate(`/${type}s`);
    } catch (error) {
      console.error(`Error editing ${type}:`, error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        // Implement your delete logic here
        // Example: Delete the category or item
        await axiosInstance.delete(`/api/${type}/${id}`);

        // Navigate back to the categories or items page after deleting
        navigate(`/${type}s`);
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  return (
    <div>
      <h2>Edit and Delete {type}</h2>
      <input
        type="text"
        placeholder={`${type} Name`}
        value={data.name || ''}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        disabled={!isEditing}
      />
      {/* Include other input fields for editing properties */}
      <button onClick={isEditing ? handleEdit : () => setIsEditing(true)}>
        {isEditing ? 'Save Changes' : 'Edit'}
      </button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default EditAndDeletePage;
