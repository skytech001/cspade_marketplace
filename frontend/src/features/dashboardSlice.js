import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getSummary = createAsyncThunk(
  "dashboard/getSummary",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;

    try {
      const response = await axios.get("http://localhost:5000/orders/summary", {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    error: "",
    summary: "",
  },
  extraReducers(builder) {
    builder
      .addCase(getSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
