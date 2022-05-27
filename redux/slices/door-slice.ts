import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DoorType } from "../../components/Door";

const initialState: DoorType[] = [];

export const doorSlice = createSlice({
  name: "doors",
	initialState,
	reducers: {
		setDoors(state, action) {
      return action.payload;
		}
	}
})

export const doorActions = doorSlice.actions;