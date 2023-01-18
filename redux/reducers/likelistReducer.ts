import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MusicI } from "../../types/MusicI";

export type likelistReducerType = {
  likelistSongs: MusicI[];
};

export const initialState: likelistReducerType = {
  likelistSongs: [],
};

export const likelistReducer = createSlice({
  name: "likelist",
  initialState,
  reducers: {
    setLikelistSongsAction(state, action: PayloadAction<MusicI[]>) {
      state.likelistSongs = action.payload;
    },
    removeSongFromLikeListAction(state, action: PayloadAction<string>) {
      state.likelistSongs.filter((e) => e.id !== action.payload);
    },
  },
});

export default likelistReducer.reducer;
