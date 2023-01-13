import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Axios from "axios";

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    try {
      const response = await Axios.get(
        " https://cspade-marketplace.herokuapp.com/users",
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      return response.data;
    } catch (error) {
      const err = rejectWithValue(error.response.data.message);
      console.log(err);
      return err;
    }
  }
);

export const userSignIn = createAsyncThunk(
  "signin/UserSignin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await Axios.post(
        "https://cspade-marketplace.herokuapp.com/users/signin",
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
        "https://cspade-marketplace.herokuapp.com/users/register",
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
        `https://cspade-marketplace.herokuapp.com/users/profile`,
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

export const deleteUser = createAsyncThunk(
  "delete/deleteUser",
  async (id, { rejectWithValue, getState }) => {
    const state = getState();
    const userInfo = state.signin.userInfo;
    console.log(id);
    try {
      const response = await axios.delete(
        `https://cspade-marketplace.herokuapp.com/users/${id}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      return response.data.message;
    } catch (error) {
      const err = rejectWithValue(error.response.data.message);
      return err;
    }
  }
);

const signinSlice = createSlice({
  name: "signin",
  initialState: {
    users: [],
    error: "",
    loading: false,
    userLoading: false,
    userInfo: {},
    signinError: false,
    errorMessage: "",
    isSignedIn: false,
    updateLoading: false,
    updateSuccess: false,
    updateError: "",
    deleteUserSuccess: false,
    deleteUserError: "",
    deleteUserMessage: "",
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
    deleteReset: (state) => {
      state.deleteUserSuccess = false;
      state.deleteUserError = false;
      state.deleteUserPending = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
      })
      //delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteUserPending = false;
        state.deleteUserSuccess = true;
        state.deleteUserMessage = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUserPending = false;
        state.deleteUserError = action.payload;
      });
  },
});

export default signinSlice.reducer;
export const { userSignout, profileReset, deleteReset } = signinSlice.actions;
