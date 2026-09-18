import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface BurgerState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
  isModalOpen: boolean;
}

const initialState: BurgerState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
  isModalOpen: false
};

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  {
    state: {
      constructorItems: {
        bun: { _id: string } | null;
        constructorItems: { _id: string }[];
      };
    };
  }
>('burger/createOrder', async (_, { getState, rejectWithValue }) => {
  const { bun, constructorItems } = getState().constructorItems;

  const ingredientIds: string[] = [
    ...(bun ? [bun._id, bun._id] : []),
    ...constructorItems.map((item) => item._id)
  ];

  try {
    const response = await orderBurgerApi(ingredientIds);
    const order: TOrder = {
      _id: response.order._id,
      status: response.order.status,
      name: response.order.name,
      createdAt: response.order.createdAt,
      updatedAt: response.order.updatedAt,
      number: response.order.number,
      ingredients: ingredientIds
    };
    return order;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Ошибка оформления заказа'
    );
  }
});

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const { closeOrderModal, openModal, closeModal } = burgerSlice.actions;

export const selectOrderRequest = (state: { burger: BurgerState }) =>
  state.burger.orderRequest;
export const selectOrderModalData = (state: { burger: BurgerState }) =>
  state.burger.orderModalData;
export const selectIsModalOpen = (state: { burger: BurgerState }) =>
  state.burger.isModalOpen;

export default burgerSlice.reducer;
