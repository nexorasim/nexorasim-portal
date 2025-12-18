import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import esimReducer from './slices/esimSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    esim: esimReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;