import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Cart.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from '../../../Redux/authSlice';
import { setItemId } from '../../../Redux/itemsSlice';
import Header from '../Home/Header';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import axiosInstance from '../../../utils/axiosInstance'

function CartPage() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  console.log("userId from redux state: " + userId);
  const dispatch = useDispatch();
  const itemId = useSelector((state) => state.item);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/api/cart', {
          headers: {
            Authorization: token,
          },
        });

        if (response.data && response.data.cartItems) {
          setCart(response.data.cartItems);
          console.log(response.data.cartItems);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [cart]);

  const handleIncrement = (item) => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: token,
      'Content-Type': 'application/json',
    };

    axiosInstance
      .post('/api/cart/add', { itemId: item._id }, { headers })
      .then((response) => {
        setCart((prevCart) =>
          prevCart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        );
      })
      .catch((error) => {
        console.error('Error adding item to cart:', error);
      });
  };

  const handleDecrement = (item) => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: token,
      'Content-Type': 'application/json',
    };

    axiosInstance
      .post('/api/cart/removeitem', { itemId: item._id }, { headers })
      .then((response) => {
        setCart((prevCart) =>
          prevCart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
        );
      })
      .catch((error) => {
        console.error('Error decrementing item quantity:', error);
      });
  };

  const handleRemove = async (item) => {
    try {
      // Show a confirmation dialog using swal
      const result = await swal.fire({
        title: 'Remove Item from Cart?',
        text: 'Are you sure you want to remove this item from your cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it',
        cancelButtonText: 'No, cancel',
      });
  
      // Check the result of the dialog
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: token,
          'Content-Type': 'application/json',
        };
  
        const response = await axiosInstance.post('/api/cart/removeall', { itemId: item._id }, { headers });
  
        if (response.data.updatedCart) {
          setCart(response.data.updatedCart);
        }
        swal.fire('Removed!', 'The item has been removed from your cart.', 'success');
      } else if (result.isDismissed) {
        // User clicked "No" or closed the dialog
        swal.fire('Cancelled', 'The item was not removed from your cart.', 'info');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      swal.fire('Error', 'An error occurred while removing the item from your cart.', 'error');
    }
  };
  

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <>
    
      <Header />
      <div className="container">
        <h1 className="cart-header">Cart</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <div>
             <h1 className="restaurant-name">{cart[0].restaurantName}</h1>
            <div className="row cart-header-row mt-5">
              <div className="col">Item</div>
              <div className="col">Price</div>
              <div className="col">Quantity</div>
              <div className="col">Total</div>
              <div className="col">Actions</div>
            </div>
            {cart.map((item) => (
              <div className="row cart-item mb-3" key={item._id}>
                <div className="col">{item.name}</div>
                <div className="col">${item.price}</div>
              
                <div className="col">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleDecrement(item)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleIncrement(item)}
                  >
                    +
                  </button>
                </div>
                <div className="col">${item.price * item.quantity}</div>
                <div className="col">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <p className="cart-total text-end">Total: ${getTotalPrice()}</p>
            <button
        className="btn btn-primary"
        onClick={() => navigate('/placeorder', {
          state: {
            restaurantId: cart[0].restaurantId,
            restaurantName: cart[0].restaurantName,
          }
        })}
      >
        Proceed to Payment
      </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
