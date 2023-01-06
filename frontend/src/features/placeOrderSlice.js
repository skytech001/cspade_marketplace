import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (order, { getState }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;

    const response = await axios.post("http://localhost:5000/orders", order, {
      headers: {
        authorization: `Bearer ${userInfo.token}`,
      },
    });
    return response.data;
  }
);

const initialState = {
  orderLoading: false,
  orderError: "",
  success: false,
  thisOrder: "",
};

const placeOrderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    newOrderReset: (state) => {
      state.orderLoading = false;
      state.orderError = "";
      state.success = false;
      state.thisOrder = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.success = true;
        state.thisOrder = action.payload.order;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.success = false;
        state.orderError = action.payload;
      });
  },
});

export default placeOrderSlice.reducer;
export const { newOrderReset } = placeOrderSlice.actions;
