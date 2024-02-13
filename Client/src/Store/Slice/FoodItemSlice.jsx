// FoodItemSlice.js

import { createSlice } from '@reduxjs/toolkit';

export const FoodItemSlice = createSlice({
  name: 'foodItems',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    fetchFoodItemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFoodItemsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchFoodItemsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add more reducers as needed, such as for adding or updating food items
  }
});

export const { fetchFoodItemsStart, fetchFoodItemsSuccess, fetchFoodItemsFailure } = FoodItemSlice.actions;

export default FoodItemSlice;
