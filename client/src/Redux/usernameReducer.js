import { createSlice } from "@reduxjs/toolkit";

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    name: '',
    email: '',
  },
  reducers: {
    change: (state, action) => {
      state.name = action.payload;
    },
    changeEmail: (state, action) => {
      state.email = action.payload;
    },
  
  },
});

export const { change, changeEmail } = userProfileSlice.actions;

export default userProfileSlice.reducer;
