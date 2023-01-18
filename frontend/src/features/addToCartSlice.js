import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addItemToCart = createAsyncThunk(
  "addToCart/addItemToCart",
  async ({ id, qty }) => {
    const response = await axios.get(`http://localhost:5000/products/${id}`);

    return {
      name: response.data.name,
      seller: response.data.seller,
      image: response.data.image,
      price: response.data.price,
      countInStock: response.data.countInStock,
      product: response.data._id,
      qty,
    };
  }
);

const addToCartSlice = createSlice({
  name: "addToCart",
  initialState: {
    cartItems: [],
  },
  reducers: {
    removeItem: (state, { payload }) => {
      const newItems = state.cartItems.filter(
        (item) => item.product !== payload
      );
      state.cartItems = newItems;
    },
    cartEmpty: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      const item = action.payload;
      if (state.cartItems.length > 0) {
        const newCartItems = state.cartItems.filter((inCartItem) => {
          return inCartItem.product !== item.product;
        });

        if (newCartItems.length > 0) {
          state.cartItems = [...newCartItems, item];
        } else {
          state.cartItems = [item];
        }
      } else {
        state.cartItems = [item];
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    });
  },
});

export default addToCartSlice.reducer;
export const { removeItem, cartEmpty } = addToCartSlice.actions;
