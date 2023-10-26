// kycSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isApproved: false, // Initialize KYC status as not approved
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKycStatus: (state, action) => {
      state.isApproved = action.payload;
    },
  },
});

export const { setKycStatus } = kycSlice.actions;
export default kycSlice.reducer;
