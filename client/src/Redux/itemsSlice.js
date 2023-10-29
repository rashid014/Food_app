import { createSlice } from '@reduxjs/toolkit';

const itemSlice = createSlice({
  name: 'item',
  initialState: null, // Initial state is an empty string or your default itemId
  reducers: {
    setItemId: (state, action) => {
      return action.payload;
    },
    updateItemDetails: (state, action) => {
      // Assuming action.payload contains the updated item details
      return { ...state, ...action.payload };
    },
  },
});

export const { setItemId, updateItemDetails } = itemSlice.actions;

export default itemSlice.reducer;
