import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

axios.defaults.withCredentials = true;
const API = "http://localhost:8000";

export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdministrator: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdministrator: false,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: null }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<{ user: User }>(`${API}/auth/status`);
    return res.data.user;
  } catch (err: any) {
    if (err.response?.status === 401) return rejectWithValue(null);
    throw err;
  }
});

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (creds, { rejectWithValue }) => {
  try {
    const res = await axios.post<{ user: User }>(`${API}/auth/login`, creds);
    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Login failed");
  }
});

export const register = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (creds, { rejectWithValue }) => {
  try {
    const res = await axios.post<{ user: User }>(`${API}/auth/register`, creds);
    return res.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Register failed");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.post(`${API}/auth/logout`);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isAdministrator = action.payload ? action.payload.isAdmin : false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAdministrator = false;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAdministrator = action.payload ? action.payload.isAdmin : false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.isAdministrator = false;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAdministrator = action.payload ? action.payload.isAdmin : false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.isAdministrator = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
export const selectAuth = (s: RootState) => s.auth;
