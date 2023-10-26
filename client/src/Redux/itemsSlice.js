import { createSlice } from '@reduxjs/toolkit';

const itemSlice = createSlice({
  name: 'item',
  initialState: null, // Initial state is an empty string or your default itemId
  reducers: {
    setItemId: (state, action) => {
      return action.payload;

    },
  },
});

export const { setItemId } = itemSlice.actions;

export default itemSlice.reducer;