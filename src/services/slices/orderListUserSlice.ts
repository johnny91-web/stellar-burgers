import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, getOrderByNumberApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';

// --- Thunk: загрузка списка заказов ---
export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response as TOrder[];
  } catch (error) {
    return rejectWithValue('Не удалось загрузить заказы пользователя');
  }
});

// --- Thunk: загрузка одного заказа по номеру ---
export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('ordersList/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  } catch (error) {
    return rejectWithValue('Заказ не найден');
  }
});

// --- Типы состояния ---
type TOrderListState = {
  data: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  isRequested: boolean;
  error: string | null;
};

const initialState: TOrderListState = {
  data: [],
  currentOrder: null,
  isLoading: false,
  isRequested: false,
  error: null
};

// --- Slice ---
const orderListUserSlice = createSlice({
  name: 'ordersList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка загрузки заказов';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isRequested = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isRequested = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isRequested = false;
        state.error = action.payload ?? 'Заказ не найден';
      });
  }
});

export default orderListUserSlice.reducer;

// --- Селекторы ---
export const selectUserOrders = (state: { ordersList: TOrderListState }) =>
  state.ordersList.data;
export const selectIsOrdersLoading = (state: { ordersList: TOrderListState }) =>
  state.ordersList.isLoading;
export const selectOrdersError = (state: { ordersList: TOrderListState }) =>
  state.ordersList.error;

export const selectOrderData = (state: { ordersList: TOrderListState }) =>
  state.ordersList.currentOrder;
export const selectOrderIsRequested = (state: {
  ordersList: TOrderListState;
}) => state.ordersList.isRequested;
export const selectOrderError = (state: { ordersList: TOrderListState }) =>
  state.ordersList.error;
