import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ESIMState } from '../../types';
import { esimAPI } from '../../services/api';

const initialState: ESIMState = {
  plans: [],
  orders: [],
  isLoading: false,
  selectedPlan: null,
};

export const fetchPlans = createAsyncThunk('esim/fetchPlans', async () => {
  const response = await esimAPI.getPlans();
  return response.data;
});

export const purchasePlan = createAsyncThunk(
  'esim/purchasePlan',
  async ({ planId, paymentData }: { planId: string; paymentData: any }) => {
    const response = await esimAPI.purchasePlan(planId, paymentData);
    return response.data;
  }
);

export const fetchOrders = createAsyncThunk('esim/fetchOrders', async () => {
  const response = await esimAPI.getOrders();
  return response.data;
});

const esimSlice = createSlice({
  name: 'esim',
  initialState,
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(purchasePlan.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const { setSelectedPlan, clearSelectedPlan } = esimSlice.actions;
export default esimSlice.reducer;