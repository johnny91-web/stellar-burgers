import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';

// --- Типы ---

type TFeedData = {
  orders: TOrder[]; // <-- Было TOrder, стало TOrder[] (лента — это список)
  total: number;
  totalToday: number;
};

type TFeedState = {
  orders: TOrder[]; // <-- Было TOrder, стало TOrder[] (заказы пользователя — это список)
  feed: TFeedData | null; // Общая лента заказов
  currentOrder: TOrder | null; // Выбранный заказ для модалки
  isLoading: boolean;
  error: string | null;
};

// --- Thunks (Асинхронные экшены) ---

export const fetchFeed = createAsyncThunk<TFeedData, void>(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue('Ошибка загрузки ленты заказов');
    }
  }
);

export const fetchOrders = createAsyncThunk<TOrder[], void>(
  'feed/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue('Ошибка загрузки ваших заказов');
    }
  }
);

// --- Slice ---

const initialState: TFeedState = {
  orders: [], // <-- Было пусто, стало пустой массив
  feed: null,
  currentOrder: null,
  isLoading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<TOrder | null>) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    // --- Обработка ленты (feed) ---
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- Обработка заказов пользователя (orders) ---
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload; // payload теперь строго TOrder[]
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedSlice.reducer;
export const { setCurrentOrder, clearCurrentOrder } = feedSlice.actions;

// --- Селекторы (Безопасные) ---

export const selectUserOrders = (state: { feed?: TFeedState }) =>
  state.feed?.orders ?? []; // <-- Возвращаем пустой массив, если нет данных

export const selectCurrentOrder = (state: { feed?: TFeedState }) =>
  state.feed?.currentOrder ?? null;

export const selectFeed = (state: { feed?: TFeedState }) =>
  state.feed?.feed ?? null;

export const selectIsFeedLoading = (state: { feed?: TFeedState }) =>
  state.feed?.isLoading ?? false;

export const selectFeedError = (state: { feed?: TFeedState }) =>
  state.feed?.error ?? null;
