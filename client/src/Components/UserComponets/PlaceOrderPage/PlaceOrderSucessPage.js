import React, { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from '../Home/Header';
import RestaurantMarker from './RestaurantMarker';
import HomeMarker from './HomeMarker'
import Geocoder from 'react-map-gl-geocoder';
import MapGL, { Marker, FlyToInterpolator, NavigationControl,Source, Layer , Feature} from 'react-map-gl'; // Include FlyToInterpolator and NavigationControl
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import turf from '@turf/turf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card } from '@mui/material';
import axiosInstance from '../../../utils/axiosInstance'

mapboxgl.accessToken="pk.eyJ1IjoicmFzaGlkMDAxNCIsImEiOiJjbG80OWd6dnowYjdjMmpwMDVmM3FwcHltIn0.QbxE40btQ7RKkBDqdANVDw"

const TOKEN = 'pk.eyJ1IjoicmFzaGlkMDAxNCIsImEiOiJjbG80OWd6dnowYjdjMmpwMDVmM3FwcHltIn0.QbxE40btQ7RKkBDqdANVDw';
const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};



const OrderSuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isOrderCancelled, setOrderCancelled] = useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { restaurantId, restaurantName } = location.state || {};

  const mapRef = useRef(null);

  const [viewport, setViewport] = useState({
    width: '100%',
    height: 400,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  const [distance, setDistance] = useState(null);
  

  const handleViewportChange = (newViewport) => {
    setViewport({ ...viewport, ...newViewport });
  };

  const handleGeocoderViewportChange = (newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    handleViewportChange({ ...newViewport, ...geocoderDefaultOverrides });
  };


  const handleDownloadPDF = async () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a3',
    });
  
    // Define the content that you want to include in the PDF
    const content = document.getElementById('pdf-content');
  
    // Decrease the font size for the entire content
    pdf.setFontSize(8); // Adjust the font size as needed
  
    // Convert the entire content to a canvas
    const canvas = await html2canvas(content);
  
    // Convert the canvas to a data URL
    const imgData = canvas.toDataURL('image/png');
  
    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0);
  
    // Save the PDF
    pdf.save('order_details.pdf');
  };
  

  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const cartResponse = await axiosInstance.get('/api/cart', {
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

  
  const handleCancelOrder = async () => {
    // Show a confirmation dialog using Swal
    const result = await Swal.fire({
      title: 'Cancel Order',
      text: 'Are you sure you want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it',
    });
  
    if (result.isConfirmed) {
      try {
        // Send a request to update the order status in the database
        const response = await axiosInstance.put(`/api/orders/${orderId}`, {
          status: 'Cancelled', // Set the status to 'Cancelled'
        });
  
        if (response.data.success) {
          // Update the order status in your client-side state
          setOrderDetails((prevOrderDetails) => ({
            ...prevOrderDetails,
            status: 'Cancelled',
          }));
          setOrderCancelled(true);
  
          // Optionally, you can redirect to another page or perform other actions.
        } else {
          console.error('Failed to update order status:', response.data.message);
        }
      } catch (error) {
        console.error('Error canceling order:', error);
      }
    }
  };
  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
       
        const response = await axiosInstance.get(`/api/orders/${orderId}`);
        if (response.data) {
          setOrderDetails(response.data);
          setOrderCancelled(!response.data.isPresent); // Set the cancellation status based on isPresent
          setViewport({
            ...viewport,
            latitude:  8.4875473, // Set the restaurant's latitude
            longitude:  77.2105853, // Set the restaurant's longitude
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId,viewport]);

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
  const currentLocation = {
    latitude: 8.4875473, // Replace with the actual latitude of the current location
    longitude: 77.2105853, // Replace with the actual longitude of the current location
  };

  const DestinationLocation = {
    latitude: 8.4676, 
    longitude:  76.9386 ,
  };
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map', // Replace with the ID of your map container
      style: 'mapbox://styles/mapbox/streets-v11', // Replace with your desired map style
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
    });


    async function fetchLocationData() {
      try {
        const response = await axiosInstance.get('/api/map'); // Replace with your actual backend API URL
        if (response.data) {
          const { latitude, longitude } = response.data;
          setViewport({
            ...viewport,
            latitude: parseFloat(latitude), // Convert to a float if needed
            longitude: parseFloat(longitude), // Convert to a float if needed
          });
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
    
    // Add directions control to the map
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
    });

    map.addControl(directions, 'top-left');
  
    // Set the origin and destination for routing
    directions.setOrigin([currentLocation.longitude, currentLocation.latitude]);
    directions.setDestination([DestinationLocation.longitude, DestinationLocation.latitude]);

    // Optionally, you can add markers for the origin and destination as well
    new mapboxgl.Marker().setLngLat([currentLocation.longitude, currentLocation.latitude]).addTo(map);
    new mapboxgl.Marker().setLngLat([DestinationLocation.longitude, DestinationLocation.latitude]).addTo(map);
    
    // Calculate and update the distance
    const calculateDistance = () => {
      if (directions.getOrigin() && directions.getDestination()) {
        const origin = directions.getOrigin().geometry.coordinates;
        const destination = directions.getDestination().geometry.coordinates;
        const distance = getDistanceFromLatLonInKm(
          origin[1],
          origin[0],
          destination[1],
          destination[0]
        );
        setDistance(distance.toFixed(2) + ' km');
      }
    };

    // Add an event listener to the directions control for route updates
    directions.on('route', calculateDistance);

    // Add an event listener to the directions control for route updates
    directions.on('route', calculateDistance);
    // Cleanup the map when the component unmounts
    return () => map.remove();
  }, [currentLocation, DestinationLocation, viewport]);
        <MapboxDirections>
        position="top-right"
        options={{
          unit: 'metric',
          profile: 'mapbox/driving',
          geometries: 'polyline',
          waypoints: [
      {
      coordinates: [currentLocation.longitude, currentLocation.latitude],
      },
      {
      coordinates: [DestinationLocation .longitude, DestinationLocation .latitude],
      },
      ],
      }}
      </MapboxDirections>    
       function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1); // deg2rad below
        const dLon = deg2rad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
      }
    
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }
      function calculateEstimatedTime(distanceInKm, averageBikingSpeedKmph) {
        // Calculate the estimated time in hours
        const estimatedTimeHours = distanceInKm / averageBikingSpeedKmph;
      
        // Convert hours to minutes
        const estimatedTimeMinutes = estimatedTimeHours * 60;
      
        return estimatedTimeMinutes;
      }
      
      // Assuming an average biking speed of 15 km/h
      const averageBikingSpeedKmph = 55;
      
      // Calculate the estimated time based on the distance
      const distanceInKm = getDistanceFromLatLonInKm(
        currentLocation.latitude,
        currentLocation.longitude,
        DestinationLocation.latitude,
        DestinationLocation.longitude
      );
      
      const estimatedTimeMinutes = calculateEstimatedTime(distanceInKm, averageBikingSpeedKmph);

      const getOrderHeader = (status) => {
  switch (status) {
    case 'Pending':
      return 'Waiting for restaurant to confirm your order';
    case 'Confirmed':
      return 'Order Confirmed';
    case 'Rejected':
      return 'Order Rejected';
    case 'Cancelled':
      return 'Cancelled Order';
    case 'Delivery Partner Assigned':
      return 'Delivery Partner Assigned';
    case 'Order Picked Up':
      return 'Order Picked Up';
    case 'On the Way':
      return 'On the Way';
    case 'Delivered':
      return 'Order Delivered';
    case 'Not Delivered':
      return 'Order Not Delivered';
    default:
      return 'Order Status Unavailable';
  }
};

const getOrderSuccessMessage = (status) => {
  switch (status) {
    case 'Pending':
      return 'Please wait until the restaurant confirms your order.';
    case 'Confirmed':
      return 'Your order has been confirmed and is being prepared.';
    case 'Rejected':
      return 'Unfortunately, your order has been rejected.';
    case 'Cancelled':
      return 'Your order has been cancelled.';
    case 'Delivery Partner Assigned':
      return 'A delivery partner has been assigned to your order.';
    case 'Order Picked Up':
      return 'Your order has been picked up for delivery.';
    case 'On the Way':
      return 'Your order is on the way to your location.';
    case 'Delivered':
      return 'Your order has been delivered successfully.';
    case 'Not Delivered':
      return 'We apologize, but your order could not be delivered.';
    default:
      return 'Order Status Information Unavailable';
  }
};


  
return (
  <>
   
  <Header  />
     <div  style={{ minHeight: '100vh' }}>
   
     
     <div id="map" ref={mapRef}></div>

    
    <div className="row-just">
      <div className="col-md-8 offset-md-2 text-center">
        <div className="card-top">
          <div className="card-header">
          <h2 className="text-center order-success-header mt-5">
  {orderDetails ? getOrderHeader(orderDetails.status) : 'Loading...'}
</h2>

          </div>
          <div className="card-body">
          <p className="text-center order-success-message">
            {orderDetails ? getOrderSuccessMessage(orderDetails.status):'Loading...'}
          </p>


            {orderDetails && (
             

                <div className="card-header mt-5">
                  <div className="card-header">
                    
                  </div>
                  <div className="text-danger"> {isOrderCancelled ? 'Cancelled Order' : ''} </div>
              <div className="d-flex justify-content-between">
              {orderDetails.status === 'Pending' && (
        <button
          onClick={handleCancelOrder}
          className="btn btn-danger small-cancel-order-button"
          style={{ width: '150px' }}
        >
          Cancel Order
        </button>
              )}                
              </div>
              
              <div className="text-center mt-4">
                <button onClick={handleDownloadPDF} className="btn btn-primary">
                  Download PDF
                </button>
                
                </div>
                <div id="pdf-content">
                  <div className="card-body">
                  <h2 className="text-center mt-5">INVOICE</h2>
                    <table className="table table-bordered">
                    <div>
                   </div>

                      <tbody>
                      <tr>
                          <td>Restaurant Id:</td>
                          <td>{restaurantId}</td>
                        </tr>
                        <tr>
                          <td>Restaurant Name:</td>
                          <td>{restaurantName}</td>
                        </tr>
                        <tr>
                          <td>Order ID:</td>
                          <td>{orderDetails._id}</td>
                        </tr>
                        <tr>
                          <td>Customer Name:</td>
                          <td>{orderDetails.customerName}</td>
                        </tr>
                        <tr>
                          <td>Contact Number:</td>
                          <td>{orderDetails.contactNumber}</td>
                        </tr>
                        <tr>
                          <td>Delivery Address:</td>
                          <td>{orderDetails.deliveryAddress}</td>
                        </tr>
                        <tr>
                          <td>Status:</td>
                          <td>{orderDetails.status}</td>
                        </tr>
                        {/* Add more rows as needed */}
                      </tbody>
                    </table>
                  </div>
           
            <div className="card-middle mt-5">
              <div className="card-header">
                <h2 className="text-center">Order Items</h2>
              
              <div className="card-body">
                <table className="table table-bordered">
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
              </div>
            </div>

            <div className="card-bottom mt-5">
              <div className="card-header">
                <h2 className="text-center">Order Summary</h2>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
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
            )}

            {orderDetails && !isOrderCancelled && (
                <div>
                  <div className="card-middle mt-5">
                    <div className="card-header">
                      <h2 className="text-center">Directions</h2>
                    </div>
                    <div className="card-body">
                      <div>
                      
                      <MapGL 
                        
                          ref={mapRef}
                          {...viewport}
                          mapStyle="mapbox://styles/denizzed/cjyu2kr5e0rqq1cry6wmo3rhg"
                          mapboxApiAccessToken={TOKEN}
                          onViewportChange={handleViewportChange}
                        >
                          <div className="nav" style={navStyle}>
                            <NavigationControl />
                          </div>
                          <Geocoder
                            mapRef={mapRef}
                            onViewportChange={handleGeocoderViewportChange}
                            mapboxApiAccessToken={TOKEN}
                          />

                          <Marker
                              latitude={currentLocation.latitude}
                              longitude={currentLocation.longitude}
                            >
                           
                              <RestaurantMarker />
                            </Marker>
                            <Marker
                              latitude={DestinationLocation.latitude}
                              longitude={DestinationLocation.longitude}
                           
                            >   
                               <HomeMarker /> 
                            </Marker>
                            <div className="route-line">
                            <svg
                              width="100%"
                              height="100%"
                              style={{ position: 'absolute', pointerEvents: 'none' }}
                            >
                              <path
                                d={`M${currentLocation.longitude},${currentLocation.latitude} L${DestinationLocation.longitude},${DestinationLocation.latitude}`}
                                fill="none"
                                stroke="#FF0000"
                                strokeWidth={2}
                                strokeDasharray="4,4" // Use strokeDasharray to create a dotted line (4 pixels on, 4 pixels off)
                              />
                            </svg>
                          </div>

                            
                            <p style={{ fontWeight: 'bold', color: '#000',fontSize: '24px' ,color: '#8B0000' }}>
                            Distance from Restaurant to Your Location: {distance}
                          </p>
                          <p style={{ fontWeight: 'bold', color: '#000',fontSize: '20px' ,color: '#8B0000' }}>
                            Your order will be delivered in {estimatedTimeMinutes.toFixed(0)} minutes</p>
                            <Source id="route" type="geojson" data={{
                              type: 'Feature',
                              properties: {},
                              geometry: {
                                type: 'LineString',
                                coordinates: [
                                  [currentLocation.longitude, currentLocation.latitude],
                                  [DestinationLocation.longitude, DestinationLocation.latitude],
                                ],
                              },
                            }}>
                              <Layer
                                id="route"
                                type="line"
                                source="route"
                                layout={{
                                  'line-join': 'round',
                                  'line-cap': 'round',
                                }}
                                paint={{
                                  'line-color': '#FF0000',
                                  'line-width': 2,
                                  'line-dasharray': [2, 2], // Adjust this for your desired dash pattern
                                }}
                              />
                            </Source>


                       </MapGL>
                        
                      </div>
                    </div>
                  </div>
                </div>
              )}

            <div className="text-center mt-4">
              <a href="/" className="btn btn-primary back-button">
                Back to Dashboard
              </a>
            
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>

  </>
);
// ...

};

export default OrderSuccessPage;
