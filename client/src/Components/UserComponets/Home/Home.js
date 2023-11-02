import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import Toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default CSS
import Swal from 'sweetalert2';

import { changeId } from '../../../Redux/restaurantIdsReducer';
import { setCategoryId } from '../../../Redux/categoryIdSlice';
import { setItemId } from '../../../Redux/itemsSlice';
import { addItemToCart } from '../../../Redux/cartSlice';
import Card from '@mui/material/Card';




const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantId = useSelector((state) => state.restaurantId);
  console.log(restaurantId,"rest id ---->")
  const [rid,setRid]=useState( restaurantId)
  const categoryId = useSelector((state) => state.category);
  const itemId = useSelector((state) => state.item);
  const initialCartState = [];
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(initialCartState);

  useEffect(() => {
    fetchRestaurants();
    fetchItems();
  }, [restaurantId]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/restaurants/${restaurantId}`);
      setRestaurants(response.data);
      console.log("data "+JSON.stringify(response.data))
      // setRestaurantId(response.data)
      // Fetch categories for the first restaurant (you can modify this logic as needed)
      if (response.data.length > 0) {
        fetchCategories(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Error fetching restaurants. Please try again.', { position: 'top-right' }); // Display error as toast
    }
  };

  const fetchCategories = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/${restaurantId}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories. Please try again.', { position: 'top-right' }); // Display error as toast
    }
  };

  const fetchItems = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/restaurants/items`);
      console.log("my res", response.data);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Error fetching items. Please try again.', { position: 'top-right' }); // Display error as toast
    }
  };

  const handleRestaurantClick = async (restaurant) => {
    try {
      console.log('Restaurant clicked:', restaurant);
      dispatch(changeId(restaurant._id));

      const response = await axios.get(`http://localhost:4000/api/restaurants/${restaurant._id}`);
      setRestaurants(response.data);

      // Fetch categories for the selected restaurant
      fetchCategories(restaurant._id);

      navigate(`/restaurant/${restaurant._id}`);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      toast.error('Error fetching restaurant details. Please try again.', { position: 'top-right' });
    }
  };

  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
    dispatch(setItemId(item._id));
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
    <div className={styles['parent-container']}>
      <div className={styles['homepage-container']}>
        <h1 className="display-4 mb-5">
          <div className="card text-center" style={{ width: '1450px' }}>
            <img
              src="https://i.imgur.com/kDe8xDB.jpeg" // Replace with the actual image path
              alt="Static Restaurant Image"
              className="card-img-top mx-auto" // Use mx-auto to center the image horizontally
            />
          </div>
        </h1>

        <div className={styles['horizontal-container']}>
          {/* Restaurants */}
          <div className={styles['list-container']}>
            <h2>Restaurants</h2>
            <div
              className={`d-flex ${styles['horizontal-list-container']}`}
              style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}
            >
              <ul className={styles['horizontal-list']} style={{ overflowX: 'hidden' }}>
                {restaurants.map((restaurant) => (
                 
                  <li
                    key={restaurant._id}
                    className={`list-group-item list-group-item-action ${styles['restaurant-card']}`}
                    onClick={() => handleRestaurantClick(restaurant)}
                    style={{ width: '200px', margin: '10px' }}
                  >
                    <div className=" d-flex align-items-center">
                      <img
                        src={`http://localhost:4000/${restaurant.restaurantImageFile}`} // Set the correct path to your images
                        alt={restaurant.restaurantName}
                        className={styles['restaurant-image']}
                      />
                    </div>
                    {restaurant.restaurantName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Categories */}
          {/* <div className={styles['list-container']}>
            <h2>Categories</h2>
            <div className={styles['horizontal-list-container']}>
              <ul className={styles['horizontal-list']}>
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className={`list-group-item list-group-item-action ${styles['horizontal-list-item']}`}
                  >
                    <Link to={`/categorylist/${category.id}`}>
                      <div className={styles['category-item']}>
                        <img src={`http://localhost:4000/${category.image}`} alt={category.name} />
                      </div>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div> */}
          {/* Items */}
          <div className={styles['list-container']}>
            <h2>Items</h2>
            <div className={styles['horizontal-list-container']}>
              <ul className={styles['horizontal-list']}>
                {items.map((item) => (
                  <li
                    key={item._id}
                    className={`list-group-item list-group-item-action ${styles['horizontal-list-item']}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className={styles['item']}>
                      <img src={`http://localhost:4000/${item.image}`} alt={item.name} />
                    </div>
                    {item.name}
                    <div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCartClick(item, rid)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
