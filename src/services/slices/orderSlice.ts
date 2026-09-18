import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

interface OrdersState {
  data: TOrder[];
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  data: [],
  currentOrder: null,
  loading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrdersData>) => {
      state.data = action.payload.orders;
    },

    addOrderToProfile: (state, action: PayloadAction<TOrder>) => {
      state.data.unshift(action.payload);
    },

    setCurrentOrder: (state, action: PayloadAction<TOrder | null>) => {
      state.currentOrder = action.payload;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (!action.payload) state.loading = false;
    }
  }
});

export const {
  setOrders,
  addOrderToProfile,
  setCurrentOrder,
  clearCurrentOrder,
  setLoading,
  setError
} = ordersSlice.actions;

export const selectOrders = (state: { orders?: OrdersState }): TOrder[] =>
  state.orders?.data ?? [];

export const selectCurrentOrder = (state: {
  orders?: OrdersState;
}): TOrder | null => state.orders?.currentOrder ?? null;

export const selectOrdersLoading = (state: { orders?: OrdersState }): boolean =>
  state.orders?.loading ?? false;

export const selectOrdersError = (state: {
  orders?: OrdersState;
}): string | null => state.orders?.error ?? null;

export default ordersSlice.reducer;
