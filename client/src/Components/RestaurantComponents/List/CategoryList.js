import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryListPage = () => {
  const { categoryId } = useParams(); // Get the categoryId from the route parameters
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurants for the selected category
    const fetchRestaurantsByCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/getRestaurantsByCategory/${categoryId}`);
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurantsByCategory();
  }, [categoryId]);

  return (
    <div>
      <h2>Restaurants in this Category</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id}>
            <h3>{restaurant.restaurantName}</h3>
            <p>Category: {restaurant.categoryName}</p>
            <img src={restaurant.imageUrl} alt={restaurant.restaurantName} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryListPage;
