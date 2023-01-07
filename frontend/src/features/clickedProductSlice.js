import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  clickedProd: "",
  loadingClicked: false,
  clickedError: false,
  isWorking: false,
};

export const getClickedProduct = createAsyncThunk(
  "clickedProductDetail/getClickedProduct",
  async (id) => {
    try {
      const response = await axios.get(
        `https://cspade-marketplace.herokuapp.com/products/${id}`
      );

      return response.data;
    } catch (error) {
      return error.data;
    }
  }
);

const clickedProductSlice = createSlice({
  name: "clickedProductDetail",
  initialState,
  reducer: {},
  extraReducers(builder) {
    builder
      .addCase(getClickedProduct.pending, (state) => {
        state.loadingClicked = true;
      })
      .addCase(getClickedProduct.fulfilled, (state, action) => {
        state.loadingClicked = false;
        state.clickedProd = action.payload;
      })
      .addCase(getClickedProduct.rejected, (state) => {
        state.loadingClicked = false;
        state.clickedError = true;
      });
  },
});

export default clickedProductSlice.reducer;
