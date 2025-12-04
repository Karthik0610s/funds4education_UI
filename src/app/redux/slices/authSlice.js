// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginReq } from "../../../api/Users/login";

// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password, userType }, { rejectWithValue }) => {
    try {
      let response;

      // ✅ Choose API based on userType
      if (["student", "sponsor", "institution"].includes(userType)) {
        response = await loginReq({ username, password,userType });
      } else {
        throw new Error("Unsupported user type");
      }

      const data = response.data;

      // ✅ Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("expiresAt", data.expiresAt);
      localStorage.setItem("roleId", data.roleId);
      localStorage.setItem("roleName", data.roleName || "");
      localStorage.setItem("username", data.username);
      localStorage.setItem("name", data.name);
      localStorage.setItem("userType", userType);

      // ✅ Store IDs separately — do not overwrite
      localStorage.setItem("id", data.id);         // ✅ Student record ID (used for GET /student/:id)
      localStorage.setItem("userId", data.userId); // ✅ User account ID (for login/auth)
localStorage.setItem("firstName", data.firstName );
localStorage.setItem("lastName", data.lastName);
localStorage.setItem("email", data.email);
localStorage.setItem("phoneNumber", data.phone);
localStorage.setItem("dateOfBirth", data.dateofBirth);
localStorage.setItem("gender", data.gender);     

      // ✅ Return response data
      return { ...data, userType };
    } catch (error) {
      debugger;
      return rejectWithValue(error.response?.data?.message || error.errorMsg || "Login failed");
    }
  }
);

const initialState = {
  name: null,
  username: null,
  roleId: null,
  roleName: null,
  id: null,        // ✅ Student record ID
  userId: null,    // ✅ User account ID
  token: null,
  userType: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.name = null;
      state.username = null;
      state.roleId = null;
      state.roleName = null;
      state.id = null;
      state.userId = null;
      state.token = null;
      state.userType = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // ✅ Success
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const {
          name,
          username,
          roleId,
          roleName,
          id,       // ✅ Student record ID
          userId,   // ✅ User account ID
          token,
          userType,
        } = action.payload;

        // ✅ Save details to state
        state.name = name;
        state.username = username;
        state.roleId = roleId;
        state.roleName = roleName;
        state.id = id;
        state.userId = userId;
        state.token = token || null;
        state.userType = userType;

        // ✅ Store locally for persistence
        localStorage.setItem("name", name || "");
        localStorage.setItem("username", username || "");
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("roleName", roleName || "");
        localStorage.setItem("id", id);        // ✅ Student record ID
        localStorage.setItem("userId", userId);
        localStorage.setItem("userType", userType);
        if (token) localStorage.setItem("token", token);
      })
      // Failed
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid credentials";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
