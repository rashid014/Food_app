// PartnerIdSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  partnerId: '',
};

const partnerIdSlice = createSlice({
  name: 'partnerId',
  initialState,
  reducers: {
    changePartnerId: (state, action) => {
      state.partnerId = action.payload;
    },
  },
});

export const { changePartnerId } = partnerIdSlice.actions;
export default partnerIdSlice.reducer;
