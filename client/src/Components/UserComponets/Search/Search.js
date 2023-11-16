import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { Grid } from '@mui/material';
import { changeId } from '../../../Redux/restaurantIdsReducer';
import Header from '../Home/Header'
import Swal from 'sweetalert2';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import axiosInstance from '../../../utils/axiosInstance'
function SearchResults() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialCartState = [];
  const restaurantId = useSelector((state) => state.restaurantId);
  const [restaurants, setRestaurants] = useState([]);
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('term');
  const [restaurantResults, setRestaurantResults] = useState([]);
  const [rid,setRid]=useState( restaurantId)
  const [itemResults, setItemResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(initialCartState);
 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const restaurantResponse = await axiosInstance.get(`/search/restaurants?term=${searchTerm}`);
        const itemResponse = await axiosInstance.get(`/search/items?term=${searchTerm}`);

        setRestaurantResults(restaurantResponse.data.results);
        setItemResults(itemResponse.data.results);
    
      } catch (error) {
        console.error(error);
      }
    };
    console.log("this is res" +searchTerm)

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  const fetchCategories = async (restaurantId) => {
    try {
      const response = await axiosInstance.get(`/api/${restaurantId}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    
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

  return (
    <>
   <Header />
    <div style={{marginLeft:100}}>
      <h2 >Restaurants</h2>

      <div
            
              style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}
            >
 <Grid container spacing={3}>
      {restaurantResults.map((restaurant) => (
        <Grid item xs={12} sm={6} md={2} lg={3} key={restaurant._id}>

          <Card
           className={`list-group-item list-group-item-action `}
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
      <div>
      <h2>Items</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap',marginBottom:520 }}>
        {itemResults.map((result) => (
          <Card key={result._id} style={{ width: 200, margin: 16 }}>
            <CardMedia component="img" height="140" image={`http://localhost:4000/${result.image}`} alt={result.name} />
            <CardContent>
              <Typography variant="h6">{result.name}</Typography>
            </CardContent>
            <div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleAddToCartClick(result, rid)}
          >
            <ShoppingCartCheckoutIcon />
            Add to Cart
          </button>
        </div>
          </Card>
        ))}
      </div>
    </div>
    </div>
    </>
  );
}

export default SearchResults;
