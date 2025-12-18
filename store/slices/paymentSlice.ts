import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentState } from '../../types';
import { paymentAPI } from '../../services/api';

const initialState: PaymentState = {
  methods: [],
  isProcessing: false,
  lastTransaction: null,
};

export const fetchPaymentMethods = createAsyncThunk(
  'payment/fetchMethods',
  async () => {
    const response = await paymentAPI.getMethods();
    return response.data;
  }
);

export const processPayment = createAsyncThunk(
  'payment/process',
  async (paymentData: any) => {
    const response = await paymentAPI.processPayment(paymentData);
    return response.data;
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearLastTransaction: (state) => {
      state.lastTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.methods = action.payload;
      })
      .addCase(processPayment.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.lastTransaction = action.payload;
      })
      .addCase(processPayment.rejected, (state) => {
        state.isProcessing = false;
      });
  },
});

export const { clearLastTransaction } = paymentSlice.actions;
export default paymentSlice.reducer;