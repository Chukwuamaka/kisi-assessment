import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth-slice";
import { doorSlice } from "./slices/door-slice";
import { groupSlice } from "./slices/group-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    groups: groupSlice.reducer,
    doors: doorSlice.reducer
  }
})

export default store;

export type RootState = ReturnType<typeof store.getState>;