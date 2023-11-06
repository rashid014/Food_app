import React, { useState, useEffect } from 'react';
import './RestaurantHome.css'; // Updated CSS file
import axios from 'axios';
import RestaurantHeader from '../RestaurantHeader/RestaurantHeader';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId } from '../../../Redux/categoryIdSlice';
import { setItemId } from '../../../Redux/itemsSlice';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import Button from '@mui/material/Button'; 

const Unique1RestaurantOwnerHomePage = () => {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const categoryId = useSelector((state) => state.category); // Get categoryId from Redux
  const itemId = useSelector((state) => state.item); // Get itemId from Redux
  const navigate = useNavigate();
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

  // State for controlling the edit modal
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [restaurantId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/${restaurantId}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleGetStartedClick = () => {
    navigate(`/kyc/${restaurantId}`);
  };

  const handleDeleteItem = async (categoryId, itemId) => {
    try {
      // Show a confirmation dialog using swal
      const result = await swal.fire({
        title: 'Delete Item?',
        text: 'Are you sure you want to delete this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'No, cancel',
      });

      // Check the result of the dialog
      if (result.isConfirmed) {
        // User clicked "Yes," proceed with deletion
        await axios.delete(`http://localhost:4000/api/${restaurantId}/categories/${categoryId}/items`, { data: { itemId } });
        // Update the UI by refetching categories
        fetchCategories();
        swal.fire('Deleted!', 'The item has been deleted.', 'success');
      } else if (result.isDismissed) {
        // User clicked "No" or closed the dialog
        swal.fire('Cancelled', 'The item was not deleted.', 'info');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      swal.fire('Error', 'An error occurred while deleting the item.', 'error');
    }
  };

  // Function to open the edit modal
  const openEditModal = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setEditItem(null);
    setEditModalOpen(false);
  };

  // Function to save the edited item
  const saveEditedItem = async () => {
    try {
      // Implement your logic to save the edited item
      // For example, you can make an API request to update the item
      // After saving, close the edit modal
      // Update the UI by refetching categories
      await axios.put(`http://localhost:4000/api/${restaurantId}/categories/${editItem.categoryId}/items/${editItem._id}`, editItem);
      fetchCategories();
      swal.fire('Item Edited', 'The item has been successfully edited.', 'success');
      closeEditModal();
    } catch (error) {
      console.error('Error editing item:', error);
      swal.fire('Error', 'An error occurred while editing the item.', 'error');
    }
  };

  const openEditModalWithSwal = (item) => {
    const mealOptions = ['Breakfast', 'Lunch', 'Dinner'];
    const timeRangeOptions = [
      '12:00 AM - 5:00 AM',
      '5:00 AM - 12:00 PM',
      '12:00 PM - 5:00 PM',
      '5:00 PM - 12:00 AM',
    ];

    const selectStyle = 'style="width: 100%; height: 30px;"'; // Set a fixed width for select elements

    const html = `
      <div class="unique1-edit-item-modal">
        <div class="unique1-edit-item-modal-content">
          <h2></h2>
          <label>Name</label>
          <input type="text" value="${item.name}" id="editItemName" />
          <label>Price</label>
          <input type="text" value="${item.price}" id="editItemPrice" />
          <label>Type of Meal</label>
          <select id="editItemTypeOfMeal" ${selectStyle}>
            ${mealOptions.map(
              (option) => `
                <option value="${option}" ${
                item.typeOfMeal === option ? 'selected' : ''
              }>${option}</option>`
            ).join('')}
          </select>
          <label>Time Available</label>
          <select id="editItemTimeAvailable" ${selectStyle}>
            ${timeRangeOptions.map(
              (option) => `
                <option value="${option}" ${
                item.timeAvailable === option ? 'selected' : ''
              }>${option}</option>`
            ).join('')}
          </select>
       
        </div>
      </div>
    `;

    swal
      .fire({
        title: 'Edit Item',
        html: html,
        showCancelButton: true,
        confirmButtonText: 'Save',
      })
      .then((result) => {
        if (result.isConfirmed) {
          const editedItem = {
            name: document.getElementById('editItemName').value,
            price: document.getElementById('editItemPrice').value,
            typeOfMeal: document.getElementById('editItemTypeOfMeal').value,
            timeAvailable: document.getElementById('editItemTimeAvailable').value,
          };

          // Check if a new image was selected
        

          axios
            .put(`http://localhost:4000/api/${restaurantId}/categories/${item.categoryId}/items/${item._id}`, editedItem)
            .then((response) => {
              console.log('Item updated successfully', response.data);
              fetchCategories();
            })
            .catch((error) => {
              console.error('Error updating item:', error);
              swal.fire('Error', 'An error occurred while updating the item.', 'error');
            });
        }
      });
  };

  return (
    <>
    <RestaurantHeader />
    <div className="unique1-restaurant-owner-homepage">
      <section className="unique1-hero">
        
        <div className="unique1-hero-content">
        <h1 className="homies" style={{ color: 'black', textAlign: 'center' }}>
  Welcome to Your Restaurant Partner Dashboard
</h1>

          <p className='homies' style={{color:'black'}}>Unlock the full potential of your restaurant with our platform.</p>
        </div>
      </section>

      <div className="unique1-category-sidebar">
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
          <Button
            href={`#category-${category._id}`}
            variant="text"
            color="primary"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}
          >
            {category.name}
          </Button>

            </li>
          ))}
        </ul>
      </div>

      <div className="unique1-category-container">
        {categories.map((category) => (
          <div key={category._id} className="unique1-category" id={`category-${category._id}`}>
            <div className="unique1-category-header">{category.name}</div>
            <div className="unique1-category-content">
              {category.items &&
                category.items.map((item) => (
                  <div key={item._id} className="unique1-item">
                    <img src={`http://localhost:4000/${item.image}`} alt={item.name} />
                    <div className="unique1-item-content">
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                      <p>Type of Meal: {item.typeOfMeal}</p>
                      <p>Time Available: {item.timeAvailable}</p>
                      {/* Edit Item button */}
                      <button className="unique1-edit-item-button" onClick={() => openEditModalWithSwal(item)}>
                        Edit Item
                      </button>

                         {/* Edit Modal */}
   
                      {/* Delete Item button */}
                      <button className="unique1-delete-item-button" onClick={() => handleDeleteItem(category._id, item._id)}>
                        Delete Item
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <section className="unique1-commission-plans">
        <div className="unique1-commission-plans-content">
          <h2>Flexible Commission Plans</h2>
          <p>
            We offer a variety of commission plans tailored to your restaurant's needs. Whether you're looking for a
            fixed-rate commission or a performance-based model, we've got you covered. Our goal is to help you maximize
            your profits while growing your customer base.
          </p>
        </div>
      </section>

      <section className="unique1-facilities-and-features">
        <div className="unique1-facilities-features-content">
          <h2>Facilities and Features</h2>
          {categories.map((category) => (
            <div key={category._id} className="unique1-feature">
              <div className="unique1-feature-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <div className="unique1-feature-text">
                <h3>Online Ordering</h3>
                <p>Accept orders online with ease, providing convenience to your customers.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="unique1-get-started">
        <div className="unique1-get-started-content">
          <h2>Ready to Get Started?</h2>
          <p>Join our network of successful restaurant partners and take your business to the next level.</p>
          <button className="unique1-get-started-button" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </section>

   
    </div>
    </>
  );
};

export default Unique1RestaurantOwnerHomePage;
