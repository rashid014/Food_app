// RestaurantIdSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantId: '',
};

const restaurantIdSlice = createSlice({
  name: 'restaurantId',
  initialState,
  reducers: {
    changeId: (state, action) => {
      state.restaurantId = action.payload;
    },
  },
});

export const { changeId } = restaurantIdSlice.actions;
export default restaurantIdSlice.reducer;
