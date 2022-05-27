import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const groupSlice = createSlice({
  name: "groups",
	initialState: [],
	reducers: {
		setGroups(state, action) {
      return action.payload;
		}
	}
})

export const groupActions = groupSlice.actions;