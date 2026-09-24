import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import feedReducer from './slices/feedSlice';
import burgerReducer from './slices/burgerSlice';
import userReducer from './slices/userSlice';
import constructorReducer from './slices/constructorSlice';
import ordersReducer from './slices/orderSlice';
import orderListUserReducer from './slices/orderListUserSlice';
import orderCurrentReducer from './slices/orderCurrentSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burger: burgerReducer,
  user: userReducer,
  constructorItems: constructorReducer,
  orders: ordersReducer,
  ordersList: orderListUserReducer,
  currentOrder: orderCurrentReducer
});
