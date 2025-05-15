import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios from "axios";

axios.defaults.withCredentials = true;
const API = "http://localhost:8000";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image_path?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const fetchCart = createAsyncThunk<CartItem[], void>(
  "cart/fetchCart",
  async (_, { rejectWithValue, getState }) => {
    const { auth } = getState() as RootState; 
    if (!auth.isAuthenticated) {
      return rejectWithValue("User not authenticated");
    }
    try {
      const res = await axios.get<{ cart_items: CartItem[] }>(`${API}/cart`);
      return res.data.cart_items || []; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch cart"
      );
    }
  }
);
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((items) => items.id !== action.payload);
    },

    updateCart: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addToCart, removeFromCart, updateCart } = cartSlice.actions;
export const selectCart = (s: RootState) => s.cart;

export default cartSlice.reducer;
