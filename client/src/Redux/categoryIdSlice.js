import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: '', // Initial state is an empty string or your default categoryId
  reducers: {
    setCategoryId: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCategoryId } = categorySlice.actions;

export default categorySlice.reducer;