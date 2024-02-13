import { configureStore } from "@reduxjs/toolkit";
import { FoodItemSlice } from "./Slice/FoodItemSlice";


const Store = configureStore({
  reducer: {
    foodItems: FoodItemSlice.reducer
  }
});

export default Store;
