// orderSlice.js

import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
  },
  reducers: {
    placeOrder: (state, action) => {
      
      state.orders.push(action.payload);
    },
    updateOrderStatus: (state, action) => {
      // Update the status of a specific order based on order ID
      const { orderId, newStatus } = action.payload;
      const orderToUpdate = state.orders.find((order) => order.id === orderId);
      if (orderToUpdate) {
        orderToUpdate.status = newStatus;
      }
    },
  },
});

export const { placeOrder, updateOrderStatus } = orderSlice.actions;

export default orderSlice.reducer;
