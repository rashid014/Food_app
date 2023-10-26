// kycSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kycSubmissions: [],
  approvedKycIds: [], // Store approved KYC submission IDs
  kycValidatedIds: [], // Store validated KYC submission IDs
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKycSubmissions: (state, action) => {
      state.kycSubmissions = action.payload;
    },
    approveKycSubmission: (state, action) => {
      state.approvedKycIds.push(action.payload);
    },
    validateKycSubmission: (state, action) => {
      state.kycValidatedIds.push(action.payload);
    },
  },
});

export const { setKycSubmissions, approveKycSubmission, validateKycSubmission } = kycSlice.actions;

export default kycSlice.reducer;
