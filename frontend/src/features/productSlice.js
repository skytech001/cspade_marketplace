import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProductList = createAsyncThunk(
  "products/getProductList",
  async () => {
    try {
      const response = await axios.get(
        "https://cspade-marketplace.herokuapp.com/products"
      );
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;

    try {
      const response = await axios.post(
        "http://localhost:5000/products",
        data,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      return rejectWithValue(
        `${message}:  Product name already exist. Please choose another name for your product.`
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (data, { getState, rejectWithValue }) => {
    const { id, productData } = data;
    const state = getState();
    const userInfo = state.signin.userInfo;
    try {
      const response = await axios.put(
        `http://localhost:5000/products/${id}`,
        productData,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      return rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (product, { getState, rejectWithValue }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    try {
      const response = await axios.delete(
        `http://localhost:5000/products/${product._id}`,
        {
          headers: { authorization: `bearer ${userInfo.token}` },
        }
      );
      return response.data.message;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      return rejectWithValue(message);
    }
  }
);

const initialState = {
  productList: [],
  isLoading: false,
  error: false,
  createLoading: false,
  createError: false,
  createSuccess: false,
  createdProduct: false,
  deleteSuccess: false,
  deleteLoading: false,
  deleteError: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    createProductReset: (state) => {
      state.createLoading = false;
      state.createError = false;
      state.createSuccess = false;
      state.createdProduct = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProductList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload;
      })
      .addCase(getProductList.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })
      //create new product
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = action.payload.message;
        state.createdProduct = action.payload.product;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      //update product
      .addCase(updateProduct.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = action.payload.message;
        state.createdProduct = action.payload.product;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export default productSlice.reducer;
export const { createProductReset } = productSlice.actions;
