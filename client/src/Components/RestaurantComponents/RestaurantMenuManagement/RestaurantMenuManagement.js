import React, { useState, useEffect } from 'react';
import './RestaurantMenuManagement.css'; // Updated CSS file
import axios from 'axios';
import RestaurantHeader from '../RestaurantHeader/RestaurantHeader';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId } from '../../../Redux/categoryIdSlice';
import { setItemId ,updateItemDetails} from '../../../Redux/itemsSlice';
import axiosInstance from '../../../utils/axiosInstance'

const UniqueRestaurantMenu = () => {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const categoryId = useSelector((state) => state.category);
  const itemId = useSelector((state) => state.item);

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    image: null,
    typeOfMeal: '',
    timeAvailable: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const mealOptions = ['Breakfast', 'Lunch', 'Dinner'];
  const timeRangeOptions = [
    '12:00 AM - 5:00 AM',
    '5:00 AM - 12:00 PM',
    '12:00 PM - 5:00 PM',
    '5:00 PM - 12:00 AM',
  ];

  useEffect(() => {
    fetchCategories();
  }, [restaurantId]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/api/${restaurantId}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const isNotEmptyOrSpaces = (str) => {
    return str && str.trim().length > 0;
  };

  const addCategory = async () => {
    if (isNotEmptyOrSpaces(newCategory) && newCategoryImage) {
      try {
        const formData = new FormData();
        formData.append('name', newCategory);
        formData.append('image', newCategoryImage);

        await axiosInstance.post(`/api/${restaurantId}/categories`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setNewCategory('');
        setNewCategoryImage(null);

        dispatch(setCategoryId(categoryId));
        fetchCategories();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    } else {
      alert('Category name and image are required.');
    }
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategoryImage(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setNewItem({ ...newItem, image: file });
    }
  };

  const addItemToCategory = async () => {
    if (
      selectedCategory &&
      isNotEmptyOrSpaces(newItem.name) &&
      newItem.price &&
      newItem.image &&
      newItem.typeOfMeal &&
      newItem.timeAvailable
    ) {
      try {
        const formData = new FormData();
        formData.append('name', newItem.name);
        formData.append('price', newItem.price);
        formData.append('image', newItem.image);
        formData.append('typeOfMeal', newItem.typeOfMeal);
        formData.append('timeAvailable', newItem.timeAvailable);

        await axiosInstance.post(
          `/api/${restaurantId}/categories/${selectedCategory}/items`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setNewItem({
          name: '',
          price: '',
          image: null,
          typeOfMeal: '',
          timeAvailable: '',
        });
        setImageFile(null);

        dispatch(setItemId(itemId));
        fetchCategories();
      } catch (error) {
        console.error('Error adding item:', error);
      }
    } else {
      alert('Item name, price, image, type of meal, and time available are required.');
    }
  };

  

  return (
    <>
     <RestaurantHeader />
    <div className="unique-restaurant-menu-container">
     
      <h1>Restaurant Menu Management</h1>

      {/* Add Category */}
      <div className="unique-form-container">
        <h2>Category Management</h2>
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <label className="unique-file-input-label">
          Upload Category Image
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            className="unique-file-input"
            onChange={handleCategoryImageChange}
          />
        </label>
        <button className="unique-action-button" onClick={addCategory}>
          Add Category
        </button>
      </div>

      {/* Add Item to Category */}
      <div className="unique-form-container">
        <h2>Item Management</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Item Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <label className="unique-file-input-label">
          Upload Item Image
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            className="unique-file-input"
            onChange={handleImageChange}
          />
        </label>
        <select
          value={newItem.typeOfMeal}
          onChange={(e) => setNewItem({ ...newItem, typeOfMeal: e.target.value })}
        >
          <option value="">Select Type of Meal</option>
          {mealOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={newItem.timeAvailable}
          onChange={(e) => setNewItem({ ...newItem, timeAvailable: e.target.value })}
        >
          <option value="">Select Time Available</option>
          {timeRangeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button className="unique-action-button" onClick={addItemToCategory}>
          Add Item
        </button>
      </div>

      {/* Display Categories and Items */}
      <div className="unique-category-container">
        {categories.map((category) => (
          <div key={category._id} className="unique-category">
            <div className="unique-category-header">{category.name}</div>
            <img src={`http://localhost:4000/${category.image}`} alt={category.name} />
            <div className="unique-category-content">
              {category.items &&
                category.items.map((item) => (
                  <div key={item._id} className="unique-item">
                    <img src={`http://localhost:4000/${item.image}`} alt={item.name} />
                    <div className="unique-item-content">
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                      <p>Type of Meal: {item.typeOfMeal}</p>
                      <p>Time Available: {item.timeAvailable}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default UniqueRestaurantMenu;
