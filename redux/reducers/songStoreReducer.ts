import { MusicI } from "./../../types/MusicI";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type songStoreReducerI = {
  StoreSongs: MusicI[];
};

export const initialState: songStoreReducerI = {
  StoreSongs: [],
};

export const songsStoreReducer = createSlice({
  name: "StoreSongs",
  initialState,
  reducers: {
    setStoreSongsAction(state, action: PayloadAction<MusicI[]>) {
      state.StoreSongs = action.payload;
    },
  },
});

export default songsStoreReducer.reducer;
