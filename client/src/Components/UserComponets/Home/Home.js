import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import Toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default CSS
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import './foodie2.png'
import banner from './banner.jpg'
import burger from './burger.jpg'
import Swal from 'sweetalert2';
import { Grid } from '@mui/material';
import dosa from './dosa.jpg'
import arun from './arun2.jpg'
import sooraj from './sooraj.jpg'
import front from './front2.jpg'
import front3 from './front3.jpg'
import front4 from './front4.jpg'
import { changeId } from '../../../Redux/restaurantIdsReducer';
import { setCategoryId } from '../../../Redux/categoryIdSlice';
import { setItemId } from '../../../Redux/itemsSlice';
import { addItemToCart } from '../../../Redux/cartSlice';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import front5 from './front5.jpg'
import axiosInstance from '../../../utils/axiosInstance'


const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantId = useSelector((state) => state.restaurantId);
  console.log(restaurantId,"rest id ---->")
  const [rid,setRid]=useState( restaurantId)
  const categoryId = useSelector((state) => state.category);
  const itemId = useSelector((state) => state.item);
  const initialCartState = [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
      const response = await axiosInstance.get(`/api/restaurants/${restaurantId}`);
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
      const response = await axiosInstance.get(`/api/${restaurantId}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories. Please try again.', { position: 'top-right' }); // Display error as toast
    }
  };

  const fetchItems = async (categoryId) => {
    try {
      const response = await axiosInstance.get(`/api/restaurants/items`);
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

      const response = await axiosInstance.get(`/api/restaurants/${restaurant._id}`);
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
  
      axiosInstance.post('/api/cart/add', requestData, { headers })
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const bannerImages = [
    front4,front,front5,front3]
    
// UseEffect for banner images
useEffect(() => {
  const bannerInterval = setInterval(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
  }, 2000); // Change banner image every 2 seconds (2000 milliseconds)

  return () => {
    clearInterval(bannerInterval);
  };
}, [bannerImages]);


  return (
    <div className={styles['parent-container']}>
      <div className={styles['homepage-container']}>
      <div className="card text-center-one" style={{ width: '1450px', margin: '0 auto',height:'900px' }}>
        <img
          src={bannerImages[currentImageIndex]}
          alt="Static Restaurant Image"
          className="card-img-top mx-auto"
        />
      </div>

        <div className={styles['horizontal-container']}>
          {/* Restaurants */}
          <div className={styles['list-container']}>
          <h2 className="heading mt-5" style={{ fontFamily: 'Arial, sans-serif', fontSize: '35px', fontWeight: 'bold', color: '#333' }}>
            Restaurants
          </h2>

            <div
              className={`d-flex ${styles['horizontal-list-container']}`}
              style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}
            >
 <Grid container spacing={3}>
      {restaurants.map((restaurant) => (
        <Grid item xs={12} sm={6} md={2} lg={3} key={restaurant._id}>
          <Card
            className={`list-group-item list-group-item-action ${styles['restaurant-card']}`}
            onClick={() => handleRestaurantClick(restaurant)}
            style={{ border: '4px solid white', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CardMedia
                component="img"
                alt={restaurant.restaurantName}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                image={`https://lazyfoodie.online/${restaurant.restaurantImageFile}`}
              />
            </div>
            <CardContent>
              <Typography variant="h6" component="div">
                {restaurant.restaurantName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

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
          
          <Card>
            <CardContent>
            <h2
            className="card-title mt-5"
            style={{
              fontFamily: 'Pacifico', // Use Pacifico and fallback to cursive
              fontSize: '50px',
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            Have A Watch
          </h2>

    <div className="row">
    <div className="col-md-3">
          <Link to="/restaurant/65262883bcb7defd73040b76"> {/* Replace "/other-page" with the actual path you want to navigate to */}
            <h1 className="display-4 mb-5">
              <div className="card text-center" style={{ width: '350px' }}>
                <img
                  src={burger} // Replace with the actual image path
                  alt="Static Restaurant Image"
                  className="card-img-top mx-auto" // Use mx-auto to center the image horizontally
                />
              </div>
            </h1>
          </Link>
        </div>

      <div className="col-md-3">
      <Link to="/restaurant/65262cc6bcb7defd7304c6dd">
        <h1 className="display-4 mb-5">
          <div className="card text-center" style={{ width: '350px' }}>
            <img
              src={dosa} // Replace with the actual image path
              alt="Static Restaurant Image"
              className="card-img-top mx-auto" // Use mx-auto to center the image horizontally
            />
          </div>
        </h1>
        </Link>
      </div>
      <div className="col-md-3">
      <Link to="/restaurant/65262ecfbcb7defd7304d758">
        <h1 className="display-4 mb-5">
          <div className="card text-center" style={{ width: '350px' }}>
            <img
              src={sooraj} // Replace with the actual image path
              alt="Static Restaurant Image"
              className="card-img-top mx-auto" // Use mx-auto to center the image horizontally
            />
          </div>
        </h1>
        </Link>
      </div>
      <div className="col-md-3">
      <Link to="/restaurant/65262077bcb7defd7302ac58">
        <h1 className="display-4 mb-5">
          <div className="card text-center" style={{ width: '350px' }}>
            <img
              src={arun} // Replace with the actual image path
              alt="Static Restaurant Image"
              className="card-img-top mx-auto" // Use mx-auto to center the image horizontally
            />
          </div>
        </h1>
        </Link>
      </div>
    </div>
  </CardContent>
</Card>
       
       
          {/* <div className={styles['list-container']}>
          <h2 className="heading mt-5" style={{ fontFamily: 'Arial, sans-serif', fontSize: '35px', fontWeight: 'bold', color: '#333' }}>
            Items
          </h2>
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
          </div> */}

<div className={styles['horizontal-container']}>
  {/* Restaurants */}
  <div className={styles['list-container']}>
    <h2 className="heading mt-5" style={{ fontFamily: 'Arial, sans-serif', fontSize: '35px', fontWeight: 'bold', color: '#333' }}>
      Top Selling Items
    </h2>

    <div
      className={`d-flex ${styles['horizontal-list-container']}`}
      style={{
        width: '100%',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        display: 'flex',
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center',      // Center vertically
      }}
    >
     <Grid container spacing={4}>
  {items.slice(0, 8).map((item) => ( // Limit to the first 8 items
    <Grid item xs={12} sm={6} md={2} lg={3} key={item._id}>
      <Card
        className={`list-group-item list-group-item-action ${styles['item-card']}`}
        onClick={() => handleItemClick(item)}
        style={{ border: '4px solid white', borderRadius: '20px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CardMedia
            component="img"
            alt={item.name}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            image={`https://lazyfoodie.online/${item.image}`}
          />
        </div>
        <CardContent>
          <Typography variant="h6" component="div" style={{textAlign:'center'}}>
            {item.name}
            <div style={{textAlign:'center'}}>
            ₹{item.price}
            </div>
          </Typography>
        </CardContent>
        <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleAddToCartClick(item, rid)}
          >
            <ShoppingCartCheckoutIcon />
            Add to Cart
          </button>
        </div>
      </Card>
    </Grid>
  ))}
</Grid>

    </div>
  </div>
</div>


        </div>
      </div>
    </div>
  );
};

export default HomePage;
