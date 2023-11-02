import React, { useState, useEffect } from 'react';
import './RestaurantDetails.css'; // Updated CSS file
import axios from 'axios';
import Header from '../Home/Header';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId } from '../../../Redux/categoryIdSlice';
import { setItemId } from '../../../Redux/itemsSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import Toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default CSS
import Swal from 'sweetalert2';
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
  const initialCartState = [];
  const [cart, setCart] = useState(initialCartState);
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
      // Send an API request to delete the item with itemId in the request body
      await axios.delete(`http://localhost:4000/api/${restaurantId}/categories/${categoryId}/items`, { data: { itemId } });

      // Update the UI by refetching categories
      fetchCategories();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddToCartClick = (item) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': token,
      'Content-Type': 'application/json',
    };
  
    if (cartIsEmpty() || isSameRestaurant(item, restaurantId)) {
      const requestData = {
        itemId: item._id,
        restaurantId: restaurantId, // Use the restaurantId from Redux
      };
  
      axios.post('http://localhost:4000/api/cart/add', requestData, { headers })
        .then((response) => {
          console.log('Response:', response);
          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Item Added to Cart',
              text: 'The item has been added to your cart.',
            });
            console.log('Item added to cart:', response.data);
          } else {
            console.error('Error response:', response.data);
            handleCartError('Error Adding Item to Cart', response.data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          
         
          Swal.fire({
            icon: 'error',
            title: 'Unable to Add Item to Cart',
            text: 'Discard items from the previous restaurant before adding new items.',
            showCancelButton: true,
            confirmButtonText: 'Go to Cart', // Change the text to "Go to Cart"
            cancelButtonText: 'No, cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              // User chose to go to the cart, handle the navigation here
              // You can use React Router's Link component to navigate to the cart page
              navigate('/cart');
            }
          });
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unable to Add Item to Cart',
        text: 'Discard items from the previous restaurant before adding new items.',
      });
    }
  };
  
  
  
  function cartIsEmpty() {

    return cart.length === 0;
  }
  
  function isSameRestaurant(item) {
   
    return item.restaurantId === cart[0].restaurantId;
  }
  
  function handleCartError(title, message) {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
    });
  }
  
  return (
    <div className="unique1-restaurant-owner-homepage"> {/* Updated class name */}
      
      <section className="unique1-hero"> {/* Updated class name */}
      <Header />
        <div className="unique1-hero-content"> {/* Updated class name */}
     
        </div>
      </section>

      <div className="unique1-category-sidebar"> {/* Updated class name */}
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
                      <div>
              <button
               className="btn btn-primary btn-sm"
               onClick={() => handleAddToCartClick(item)}
               >
              Add to Cart
              </button>
              </div>
                     
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
   

    </div>
  );
};

export default Unique1RestaurantOwnerHomePage;
