import React from 'react'
import RestaurantHome from '../../Components/RestaurantComponents/RestaurantHome/RestaurantHome'
import RestaurantHeader from "../../Components/RestaurantComponents/RestaurantHeader"
function RestaurantHomePage() {
  return (
    <div>
      <RestaurantHeader/>
        <RestaurantHome/>
    </div>
  )
}

export default RestaurantHomePage