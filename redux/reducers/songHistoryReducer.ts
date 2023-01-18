import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MusicI } from "../../types/MusicI";

export type songHistoryReducerType = {
  historySongs: MusicI[];
};

export const initialState: songHistoryReducerType = {
  historySongs: [],
};

export const songHistoryReducer = createSlice({
  name: "History",
  initialState,
  reducers: {
    setSongHistoryAction(state, action: PayloadAction<MusicI[]>) {
      state.historySongs = action.payload;
    },
  },
});

export default songHistoryReducer.reducer;
