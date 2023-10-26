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
  

  return (
    <div className="unique1-restaurant-owner-homepage"> {/* Updated class name */}
      
      <section className="unique1-hero"> {/* Updated class name */}
      <RestaurantHeader />
        <div className="unique1-hero-content"> {/* Updated class name */}
          <h1>Welcome to Your Restaurant Partner Dashboard</h1>
          <p>Unlock the full potential of your restaurant with our platform.</p>
        </div>
      </section>

      <div className="unique1-category-sidebar"> {/* Updated class name */}
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              <a href={`#category-${category._id}`}>{category.name}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="unique1-category-container"> {/* Updated class name */}
        {categories.map((category) => (
          <div key={category._id} className="unique1-category" id={`category-${category._id}`}> {/* Updated class name */}
            <div className="unique1-category-header">{category.name}</div> {/* Updated class name */}
            {/* <img src={`http://localhost:4000/${category.image}`} alt={category.name} /> */}
            <div className="unique1-category-content"> {/* Updated class name */}
              {category.items &&
                category.items.map((item) => (
                  <div key={item._id} className="unique1-item"> {/* Updated class name */}
                    <img src={`http://localhost:4000/${item.image}`} alt={item.name} />
                    <div className="unique1-item-content"> {/* Updated class name */}
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                      <p>Type of Meal: {item.typeOfMeal}</p>
                      <p>Time Available: {item.timeAvailable}</p>
                      {/* Add a "Delete Item" button */}
                      <button
                        className="unique1-delete-item-button" 
                        onClick={() => handleDeleteItem(category._id, item._id)}
                      >
                        Delete Item
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <section className="unique1-commission-plans"> {/* Updated class name */}
        <div className="unique1-commission-plans-content"> {/* Updated class name */}
          <h2>Flexible Commission Plans</h2>
          <p>
            We offer a variety of commission plans tailored to your restaurant's needs. Whether you're looking for a
            fixed-rate commission or a performance-based model, we've got you covered. Our goal is to help you maximize
            your profits while growing your customer base.
          </p>
        </div>
      </section>

      <section className="unique1-facilities-and-features"> {/* Updated class name */}
        <div className="unique1-facilities-features-content"> {/* Updated class name */}
          <h2>Facilities and Features</h2>
          {categories.map((category) => (
            <div key={category._id} className="unique1-feature"> {/* Updated class name */}
              <div className="unique1-feature-icon"> {/* Updated class name */}
                <i className="fas fa-utensils"></i>
              </div>
              <div className="unique1-feature-text"> {/* Updated class name */}
                <h3>Online Ordering</h3>
                <p>Accept orders online with ease, providing convenience to your customers.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="unique1-get-started"> {/* Updated class name */}
        <div className="unique1-get-started-content"> {/* Updated class name */}
          <h2>Ready to Get Started?</h2>
          <p>Join our network of successful restaurant partners and take your business to the next level.</p>
          <button className="unique1-get-started-button" onClick={handleGetStartedClick}> {/* Updated class name */}
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default Unique1RestaurantOwnerHomePage;
