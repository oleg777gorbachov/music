import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlaylistI } from "./../../types/PlaylistI";

export type storeReducerType = {
  playlists: PlaylistI[];
};

export const initialState: storeReducerType = {
  playlists: [],
};

type ToPlaylistType = {
  playlistId: string;
  songId: string;
};

export const playlistReducer = createSlice({
  name: "Playlist",
  initialState,
  reducers: {
    setPlaylistAction(state, action: PayloadAction<PlaylistI[]>) {
      state.playlists = action.payload;
    },
    addSongToPlaylistAction(state, action: PayloadAction<ToPlaylistType>) {
      const playlistId = action.payload.playlistId;
      const songId = action.payload.songId;
      state.playlists.forEach((e) =>
        e.id === playlistId ? (e.songs = [...e.songs, songId]) : e
      );
    },
    removeSongFromPlaylistAction(state, action: PayloadAction<ToPlaylistType>) {
      const playlistId = action.payload.playlistId;
      const songId = action.payload.songId;
      state.playlists.forEach((e) =>
        e.id === playlistId
          ? (e.songs = e.songs.filter((song) => song !== songId))
          : e
      );
    },
  },
});

export default playlistReducer.reducer;
