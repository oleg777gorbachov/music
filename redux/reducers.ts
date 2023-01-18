import songsStoreReducer from "./reducers/songStoreReducer";
import songHistoryReducer from "./reducers/songHistoryReducer";
import likelistReducer from "./reducers/likelistReducer";
import userReducer from "./reducers/userReducer";
import musicReducer from "./reducers/musicReducer";
import playlistReducer from "./reducers/playlistReducer";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  user: userReducer,
  music: musicReducer,
  playlists: playlistReducer,
  likelist: likelistReducer,
  songHistory: songHistoryReducer,
  songStore: songsStoreReducer,
});
