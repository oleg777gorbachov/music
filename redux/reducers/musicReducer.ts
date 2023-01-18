import { listToPlayI } from "./../../types/listToPlayI";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MusicI } from "../../types/MusicI";

export type musicReducerType = MusicI & {
  state: "PLAY" | "PAUSE";
  nowLength: number;
  duration: number;
  volume: number;
} & listToPlayI;

type SetSongI = listToPlayI &
  MusicI & {
    isReset?: boolean;
  };

export const initialState: musicReducerType = {
  fileURL: "",
  author: "",
  id: "",
  imageURL: "",
  songName: "",
  state: "PAUSE",
  nowLength: 0,
  duration: -1,
  volume: 0.1,
  listToPlay: "GLOBALSTORE",
  authorID: "",
};

export const musicReducer = createSlice({
  name: "music",
  initialState,
  reducers: {
    stopSongAction(state) {
      state.state = "PAUSE";
    },
    playSongAction(state) {
      state.state = "PLAY";
    },
    playingAction(state) {
      state.nowLength = 1 + state.nowLength;
      if (state.nowLength >= state.duration) {
        state.state = "PAUSE";
        state.nowLength = state.duration;
      }
    },
    setSongAction(state, action: PayloadAction<SetSongI>) {
      const {
        author,
        duration,
        fileURL,
        id,
        imageURL,
        songName,
        listToPlay,
        isReset,
      } = action.payload;
      if (isReset) state.nowLength = 0;

      state.listToPlay = listToPlay;
      state.author = author;
      state.duration = duration;
      state.fileURL = fileURL;
      state.id = id;
      state.imageURL = imageURL;
      state.songName = songName;
    },
    setVolumeAction(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    setCurrentAction(state, action: PayloadAction<number>) {
      state.nowLength = action.payload;
    },
    resetSongAction(state) {
      state.nowLength = 0;
    },
  },
});

export default musicReducer.reducer;
