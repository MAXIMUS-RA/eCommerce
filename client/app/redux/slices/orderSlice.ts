import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_path: string;
  added_at?: string; 
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const createOrderFromCart = createAsyncThunk(
  "order/createOrderFromCart",
  async () => {
    try {
      const response = await axios.post("http://localhost:8000/orders/store");
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrder",
  async () => {
    try {
      const response = await axios.get("http://localhost:8000/orders");
      return response.data.orders;
    } catch (e) {
      console.log(e);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/orders/${orderId}`
      );
      return response.data.order;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order from cart
      .addCase(createOrderFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createOrderFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch specific order
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  },
});

export const { clearError } = orderSlice.actions;
export const selectOrder = (state: RootState) => state.order;
export default orderSlice.reducer;
