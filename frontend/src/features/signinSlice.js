import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const userSignIn = createAsyncThunk(
  "signin/UserSignin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await Axios.post(
        "https://cspade-marketplace.herokuapp.com/signin",
        {
          email,
          password,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userRegister = createAsyncThunk(
  "register/UserRegister",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await Axios.post(
        "http://localhost:5000/users/register",
        {
          name,
          email,
          password,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        `Email ${email} already exist. try signing in or use a diffrent email.`
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (info, { rejectWithValue, getState }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;

    try {
      const response = await Axios.put(
        `http://localhost:5000/users/profile`,
        info,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        `Email already exist. try changing to a unique email.`
      );
    }
  }
);

const signinSlice = createSlice({
  name: "signin",
  initialState: {
    userLoading: false,
    userInfo: {},
    signinError: false,
    errorMessage: "",
    isSignedIn: false,
    updateLoading: false,
    updateSuccess: false,
    updateError: "",
  },
  reducers: {
    userSignout: (state) => {
      state.userLoading = false;
      state.userInfo = {};
      state.isSignedIn = false;
      localStorage.removeItem("shippingAddress");
    },
    profileReset: (state) => {
      state.updateSuccess = false;
      state.updateError = "";
      state.updateLoading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(userSignIn.pending, (state, action) => {
        state.userLoading = true;
      })
      .addCase(userSignIn.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userInfo = action.payload;
        state.isSignedIn = true;
        state.signinError = false;

        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(userSignIn.rejected, (state, action) => {
        state.userLoading = false;
        state.userInfo = {};
        state.isSignedIn = false;
        state.signinError = true;
        state.errorMessage = action.payload;
      })
      //register reducer
      .addCase(userRegister.pending, (state, action) => {
        state.userLoading = true;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userInfo = action.payload;
        state.isSignedIn = true;
        state.signinError = false;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.userLoading = false;
        state.userInfo = {};
        state.isSignedIn = false;
        state.signinError = true;
        state.errorMessage = action.payload;
      })
      //profile update reducer
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

export default signinSlice.reducer;
export const { userSignout, profileReset } = signinSlice.actions;
