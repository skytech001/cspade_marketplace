import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProductList = createAsyncThunk(
  "products/getProductList",
  // the seller argument in the next line means that the default value of seller is empty string when nothing is passes to it from dispatch.
  async (
    {
      seller = "",
      name = "",
      category = "",
      min = 0,
      max = 0,
      rating = 0,
      order = "",
    },
    { getState }
  ) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    try {
      const response = await axios.get(
        //the ? checks if any of the char to its right  exist.
        `http://localhost:5000/products?seller=${seller}&name=${name}&category=${category}&min=${min}&max=${max}&rating=${rating}&order=${order}`
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
        // https://cspade-marketplace.herokuapp.com
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

export const createReview = createAsyncThunk(
  "products/createReview",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    const id = data.id;
    try {
      const response = await axios.post(
        `http://localhost:5000/products/${id}/reviews`,
        data,
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

export const getProductCategories = createAsyncThunk(
  "products/getProductCategories",
  async () => {
    try {
      const response = await axios.get("http://localhost:5000/products/cat");
      return response.data;
    } catch (error) {
      return error.response.data;
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
  categoryLoading: false,
  categoryError: false,
  categories: [],
  review: "",
  reviewLoading: false,
  reviewError: "",
  reviewMessage: "",
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
    createReviewReset: (state) => {
      state.reviewLoading = false;
      state.reviewError = "";
      state.reviewMessage = "";
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
      //delete product
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
      })
      //get categories
      .addCase(getProductCategories.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(getProductCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories = action.payload;
      })
      .addCase(getProductCategories.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
      })
      //create review
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.review = action.payload.review;
        state.reviewMessage = action.payload.message;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = action.payload;
      });
  },
});

export default productSlice.reducer;
export const { createProductReset, createReviewReset } = productSlice.actions;
