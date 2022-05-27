import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
	initialState: {
    email: '',
    password: ''
  },
	reducers: {
		setLoginDetails(state, action: PayloadAction<object>) {
      return {...state, ...action.payload};
		}
	}
})

export const authActions = authSlice.actions;