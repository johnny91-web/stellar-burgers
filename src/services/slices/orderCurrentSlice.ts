// src/services/slices/orderCurrentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '../../utils/types';

type TCurrentOrderState = {
  order: TOrder | null;
};

const initialState: TCurrentOrderState = {
  order: null
};

const orderCurrentSlice = createSlice({
  name: 'currentOrder', // Ключ в сторе будет 'currentOrder'
  initialState,
  reducers: {
    // Устанавливаем заказ (вызываем при клике на кнопку "Детали")
    setCurrentOrder: (state, action: PayloadAction<TOrder>) => {
      state.order = action.payload;
    },
    // Очищаем заказ (вызываем при закрытии модалки)
    clearCurrentOrder: (state) => {
      state.order = null;
    }
  }
});

export default orderCurrentSlice.reducer;
export const { setCurrentOrder, clearCurrentOrder } = orderCurrentSlice.actions;

// --- Селекторы ---
export const selectCurrentOrder = (state: {
  currentOrder: TCurrentOrderState;
}) => state.currentOrder.order;
