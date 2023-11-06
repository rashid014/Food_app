import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Header from '../Home/Header';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { removeAllItemsFromCart } from '../../../Redux/cartSlice'

function CheckoutPage(props) {
  const location = useLocation();
  const userId = useSelector((state) => state.auth.userId);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: '',
    contactNumber: '',
    deliveryAddress: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    contactNumber: '',
    deliveryAddress: '',
  });
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('COD'); // Payment method (default: Cash on Delivery)
  const { restaurantId, restaurantName } = location.state || {};
  const calculateCommission = (totalAmount) => {
  const commissionPercentage = 5;
  const commission = (totalAmount * commissionPercentage) / 100;
  return commission;
};

// Calculate remaining amount after deducting commission

  // Fetch user's cart items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const cartResponse = await axios.get('http://localhost:4000/api/cart', {
          headers: {
            Authorization: token,
          },
        });

        if (cartResponse.data && cartResponse.data.cartItems) {
          setCart(cartResponse.data.cartItems);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  // Calculate the total amount including 5% tax and delivery charge
  const getTotalAmount = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryCharge = 5; // Example delivery charge
    const taxRate = 0.05; // 5% tax rate

    const tax = (subtotal * taxRate).toFixed(2);
    const totalAmount = (subtotal + deliveryCharge + parseFloat(tax)).toFixed(2);

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax,
      deliveryCharge: deliveryCharge.toFixed(2),
      totalAmount: totalAmount,
    };
  };


  // Handle user details input
  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });

    // Trigger validation when input changes
    validateInput(name, value);
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Validate individual input fields
  const validateInput = (name, value) => {
    let errorMessage = '';

    // Check if the value is empty or just spaces
    if (value.trim() === '') {
      errorMessage = 'This field is required.';
    }

    setErrors({ ...errors, [name]: errorMessage });
  };

  // Handle form submission (place order)
  const handlePlaceOrder = async () => {
    const giveData = {

      restaurantId: cart[0].restaurantId,
      restaurantName: cart[0].restaurantName,
    }
    // Validate all input fields
    const isFormValid = Object.values(errors).every((error) => error === '');

    if (!isFormValid) {
      // If any field has errors, don't proceed with placing the order
      return;
    }

    try {
      
      const { subtotal, tax, deliveryCharge, totalAmount } = getTotalAmount();
     
      const cartItems = cart.map((item) => ({
        itemName: item.name,
        price: item.price,
        quantity: item.quantity,
        amount: item.price * item.quantity,
      }));


      const orderData = {
        items: cartItems,
        deliveryAddress: userDetails.deliveryAddress,
        deliveryCharge: deliveryCharge,
        tax: tax,
        totalAmount: totalAmount,
        customerName: userDetails.name,
        contactNumber: userDetails.contactNumber,
        paymentMethod:paymentMethod,
        restaurantId: cart[0].restaurantId,
        subtotal:subtotal,
        commission:commission,
        remainingAmount:remainingAmount,
      };
     
      const giveData = {

        restaurantId: cart[0].restaurantId,
        restaurantName: cart[0].restaurantName,
      }

     
      // Make an API request to place the order
      const token = localStorage.getItem('token');
    
      const response = await axios.post('http://localhost:4000/api/placeOrder', orderData, {
        headers: {
          Authorization: token,
        },
        
      });
      
      const orderId = response.data.orderId;
     
  
      // Show a SweetAlert for success
      Swal.fire('Order Placed Successfully', '', 'success');
      navigate(`/ordersuccess/${orderId}`,{
     
          state: giveData,
          // Other data you want to pass
      });
     
      console.log('Order placed successfully!');
    } catch (error) {
      console.error('Failed to place the order:', error);
      // Handle the error, e.g., show an error message to the user
      Swal.fire('Failed to Place Order', '', 'error');
    }
  };
    const loadScript = (src) => {
      return new Promise((resovle) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
          resovle(true);
        };

        script.onerror = () => {
          resovle(false);
        };

        document.body.appendChild(script);
      });
    };

    const totalAmount = getTotalAmount().totalAmount;
    const calculateRemainingAmount = (totalAmount) => {
      const commission = calculateCommission(totalAmount);
      const remainingAmount = totalAmount - commission;
      return remainingAmount;
    };
      const commission = calculateCommission(totalAmount);
    const remainingAmount = calculateRemainingAmount(totalAmount);

async function displayRazorpay(totalAmount) {
  
  const paymentMethod = 'ONLINE PAYMENT';
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("You are offline... Failed to load Razorpay SDK");
    return;
  }

  // ... (previous code)

const options = {
  key: "rzp_test_VdGdvprTKB8u1w",
  currency: "INR",
  amount: totalAmount * 100,
  name: "WEYGIAT",
  description: "Thanks for purchasing",
  image: "https://mern-blog-akky.herokuapp.com/static/media/logo.8c649bfa.png",
  handler: async function (response) {
    // Handle successful payment response from Razorpay


    // Only proceed with order placement if payment is successful
    if (response.razorpay_payment_id) {
      // Rest of your code for order placement
      const { subtotal, tax, deliveryCharge } = getTotalAmount();
      const cartItems = cart.map((item) => ({
        itemName: item.name,
        price: item.price,
        quantity: item.quantity,
        amount: item.price * item.quantity,
      }));

      const orderData = {
        items: cartItems,
        deliveryAddress: userDetails.deliveryAddress,
        deliveryCharge: deliveryCharge,
        tax: tax,
        totalAmount: totalAmount,
        customerName: userDetails.name,
        contactNumber: userDetails.contactNumber,
        paymentMethod:paymentMethod,
        restaurantId: cart[0].restaurantId,
        subtotal: subtotal,
        commission:commission,
        remainingAmount:remainingAmount,
      };

      const giveData = {
        restaurantId: cart[0].restaurantId,
        restaurantName: cart[0].restaurantName,
      };

      // Make an API request to place the order
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post('http://localhost:4000/api/placeOrder', orderData, {
          headers: {
            Authorization: token,
          },
        });

        const orderId = response.data.orderId;
       
      
        Swal.fire('Order Placed Successfully', '', 'success');
        navigate(`/ordersuccess/${orderId}`, {
          state: giveData,
          // Other data you want to pass
        }); 
        console.log('Order placed successfully!');

      } catch (error) {
        console.error('Error placing order:', error);
        // Handle the error, e.g., show an error message to the user
        Swal.fire('Failed to Place Order', '', 'error');
      }
    }
  },
  prefill: {
    name: "WEYGIAY",
  },
};

const paymentObject = new window.Razorpay(options);
paymentObject.open();
}

const handleRemove = async (item) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: token,
      'Content-Type': 'application/json',
    };

    const response = await axios.post('http://localhost:4000/api/orders/deletemany', { itemId: item._id }, { headers });

    if (response.data.updatedCart) {
      setCart(response.data.updatedCart);
      console.log('Item removed from cart:', item);
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    // Handle the error, e.g., show an error message to the user
  }
};


  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1 className="mb-4">Checkout</h1>
      
        <div className="row">
          <div className="col-md-6">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={userDetails.name}
                  onChange={handleUserDetailsChange}
                  required
                />
                <span className="text-danger">{errors.name}</span>
              </div>
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number:</label>
                <input
                  type="text"
                  className="form-control"
                  id="contactNumber"
                  name="contactNumber"
                  value={userDetails.contactNumber}
                  onChange={handleUserDetailsChange}
                  required
                />
                <span className="text-danger">{errors.contactNumber}</span>
              </div>
              <div className="form-group">
                <label htmlFor="deliveryAddress">Delivery Address:</label>
                <textarea
                  className="form-control"
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={userDetails.deliveryAddress}
                  onChange={handleUserDetailsChange}
                  required
                />
                <span className="text-danger">{errors.deliveryAddress}</span>
              </div>
              <div className="form-group">
                <label htmlFor="deliAddress"></label>
                <textarea
                  className="form-control"
                  id="dress"
                  name="dress"
                  value={userDetails.dAddress}
                  onChange={handleUserDetailsChange}
                  required
                />
                <span className="text-danger">{errors.deliveryAddress}</span>
              </div>
             
             
              <button
                className="buttons"
                onClick={() => handlePlaceOrder(cart[0].restaurantId, cart[0].restaurantName)}
              >
                Pay On Delivery
              </button>
              <div className="buttons mt-2">
              <button onClick={() => displayRazorpay(totalAmount)}>
                Pay through Online
              </button>
            </div>

            </form>
          </div>
          <div className="col-md-6">
            <div className="card-upper">
              <div className="card-header">Order Summary</div>
              <h1 > {restaurantName}</h1>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>${item.price}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Subtotal:</td>
                      <td>${getTotalAmount().subtotal}</td>
                    </tr>
                    <tr>
                      <td>Tax (5.00%):</td>
                      <td>${getTotalAmount().tax}</td>
                    </tr>
                    <tr>
                      <td>Delivery Charge:</td>
                      <td>${getTotalAmount().deliveryCharge}</td>
                    </tr>
                    <tr>
                      <td>Total:</td>
                      <td>${getTotalAmount().totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
