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
  product_id: number;
  description: string;
  image_path?: string;
}
interface CartItemAdd {
  product_id: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  isLoading: true,
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

export const addToCartAPI = createAsyncThunk<
  CartItem,
  CartItemAdd,
  { rejectValue: string }
>("cart/addToCartAPI", async (creds, { rejectWithValue }) => {
  try {
    const res = await axios.post<{ cart_items: CartItem[] }>(
      `${API}/cart/add`,
      creds
    );
    const items = res.data.cart_items;
    if (!items || items.length === 0) {
      return rejectWithValue("No items returned from server");
    }
    return items[items.length - 1];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.error || "Failed to add to cart"
    );
  }
});

export const removeFromCartAPI = createAsyncThunk<void, { product_id: number }>(
  "cart/removeFromCartAPI",
  async ({ product_id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/cart/remove`, { product_id });
      dispatch(fetchCart());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to remove item from cart"
      );
    }
  }
);

export const updateCartAPI = createAsyncThunk<
  CartItem[],
  { product_id: number; quantity: number }
>("cart/updateCart", async (creds) => {
  try {
    const res = await axios.post<{ cart_items: CartItem[] }>(
      `${API}/cart/update`,
      creds
    );
    return res.data.cart_items;
  } catch (error) {
    throw error;
  }
});
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (!action.payload || !action.payload.id) {
        console.error("Invalid payload:", action.payload);
        return;
      }
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload?.id
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
      action: PayloadAction<{ product_id: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.product_id !== action.payload.product_id
          );
        }
      }
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        if (!action.payload || !action.payload.id) {
          console.error("Invalid payload:", action.payload);
          return;
        }

        const existingItemIndex = state.items.findIndex(
          (item) => item.id === action.payload.id
        );

        if (existingItemIndex >= 0) {
          state.items[existingItemIndex].quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        const productId = action.meta.arg.product_id;
        state.items = state.items.filter(
          (item) => item.product_id !== productId
        );
      })
      .addCase(updateCartAPI.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateCart, setCartItems } =
  cartSlice.actions;
export const selectCart = (s: RootState) => s.cart;

export default cartSlice.reducer;
