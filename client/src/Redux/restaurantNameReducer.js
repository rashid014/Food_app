// RestaurantNameSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantName: '',
};

const restaurantNameSlice = createSlice({
  name: 'restaurantName',
  initialState,
  reducers: {
    changeName: (state, action) => {
      state.restaurantName = action.payload;
    },
  },
});

export const { changeName } = restaurantNameSlice.actions;
export default restaurantNameSlice.reducer;
