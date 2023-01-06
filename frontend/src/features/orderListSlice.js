import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../node_modules/axios/index";

export const getdetailOrder = createAsyncThunk(
  "orderList/getdetailOrder",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    try {
      const response = await axios.get(`http://localhost:5000/orders/${id}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllOrders = createAsyncThunk(
  "orderList/getAllOrders",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    try {
      const response = await axios.get("http://localhost:5000/orders", {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const myOrders = createAsyncThunk(
  "orderList/myOrders",
  async (id, { rejectWithValue, getState }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;

    try {
      const response = await axios.get("http://localhost:5000/orders/mine", {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orderList/deleteOrder",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    try {
      const response = await axios.delete(
        `http://localhost:5000/orders/${id}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deliverThisOrder = createAsyncThunk(
  "orderList/deliverThisOrder",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    try {
      const response = await axios.put(
        `http://localhost:5000/orders/${id}/deliver`,
        id,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const orderListSlice = createSlice({
  name: "orderList",
  initialState: {
    allOrders: [],
    allOrderLoading: false,
    allOrderError: "",
    deleteSuccess: false,
    loading: false,
    error: "",
    userOrders: [],
    currentOrder: "",
    deliverPending: false,
    deliverError: false,
    deliveredOrder: {},
    detailError: "",
    detailLoading: false,
    orderDetail: "",
  },
  extraReducers(builder) {
    builder
      .addCase(getdetailOrder.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(getdetailOrder.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.orderDetail = action.payload;
      })
      .addCase(getdetailOrder.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      .addCase(myOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(myOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.allOrderLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.allOrderLoading = false;
        state.allOrders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.allOrderLoading = false;
        state.allOrderError = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = action.payload;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      .addCase(deliverThisOrder.pending, (state) => {
        state.deliverPending = true;
      })
      .addCase(deliverThisOrder.fulfilled, (state, action) => {
        state.deliverPending = false;
        state.delivered = true;
        state.deliveredOrder = action.payload.order;
      })
      .addCase(deliverThisOrder.rejected, (state, action) => {
        state.deliverPending = false;
        state.deliverError = action.payload;
      });
  },
});

export default orderListSlice.reducer;
