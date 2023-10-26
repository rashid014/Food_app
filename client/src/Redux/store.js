import { configureStore } from '@reduxjs/toolkit';
import userimageReducer from './userimageReducer';
import usernameReducer from './usernameReducer';
import restaurantImageReducer from './restaurantImageReducer';
import restaurantNameReducer from './restaurantNameReducer';
import restaurantIdReducer from './restaurantIdsReducer'
import kycReducer from './kycSlice';
import kycStatus from './kycStatus';
import categoryReducer from './categoryIdSlice';
import itemReducer from './itemsSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice'; 
import partnerIdReducer from './partnerIdSlice';
import orderReducer from './orderSlice';


const store = configureStore({
  reducer: {
    userProfile: usernameReducer,
    userImage: userimageReducer,
    restaurantImage: restaurantImageReducer,
    restaurantName: restaurantNameReducer, // Use the RestaurantNameSlice reducer
    restaurantId: restaurantIdReducer,
    kyc: kycReducer,
    kycStatu: kycStatus,
    category: categoryReducer, // Add your categoryReducer to the store
    item: itemReducer, 
    auth: authReducer,
    cart: cartReducer,
    partnerId: partnerIdReducer,
    order: orderReducer,
    //  restaurantId: restaurantNameReducer, // Include your restaurantId reducer
  },
});


export default store;
