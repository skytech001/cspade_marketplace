import { createSlice } from "@reduxjs/toolkit";

const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    address: {},
  },
  reducers: {
    saveShippingAddress: (state, { payload }) => {
      state.address = payload;
      localStorage.setItem("shippingAddress", JSON.stringify(payload));
    },
  },
});

export default shippingSlice.reducer;
export const { saveShippingAddress } = shippingSlice.actions;
