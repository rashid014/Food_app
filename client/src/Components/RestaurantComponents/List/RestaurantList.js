// RestaurantList.js
import React from 'react';

const RestaurantList = ({ restaurants, onRestaurantClick }) => {
  return (
    <div>
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id} onClick={() => onRestaurantClick(restaurant)}>
            {restaurant.restaurantName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;
