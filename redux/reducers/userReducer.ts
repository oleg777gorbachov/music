import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserReducerType = {
  isAuth: boolean;
  email: string;
  username: string;
  image: string;
  uid: string;
  isVerified: boolean;
  followers: string[];
  following: string[];
  likelist: string[];
  playlists: string[];
  songHistory: string[];
};

export const initialState: UserReducerType = {
  isAuth: false,
  image: "/avatar.png",
  email: "",
  username: "",
  uid: "",
  likelist: [],
  followers: [],
  following: [],
  playlists: [],
  songHistory: [],
  isVerified: false,
};

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserReducerType>) {
      state = action.payload;
      return state;
    },
    setImage(state, action: PayloadAction<string>) {
      state.image = action.payload;
      return state;
    },
    setNickname(state, action: PayloadAction<string>) {
      state.username = action.payload;
      return state;
    },
    addToLikeList(state, action: PayloadAction<string>) {
      state.likelist = [...state.likelist, action.payload];
      return state;
    },
    removeFromLikeList(state, action: PayloadAction<string>) {
      state.likelist = state.likelist.filter((e) => e !== action.payload);
      return state;
    },
    addToPlaylist(state, action: PayloadAction<string>) {
      state.playlists = [...state.playlists, action.payload];
      return state;
    },
    removeFromPlaylist(state, action: PayloadAction<string>) {
      state.playlists = state.playlists.filter((e) => e !== action.payload);
      return state;
    },
    addToFollowing(state, action: PayloadAction<string>) {
      state.following = [...state.following, action.payload];
      return state;
    },
    removeFromFollowing(state, action: PayloadAction<string>) {
      state.following = state.following.filter((e) => e !== action.payload);
      return state;
    },
    addSongHistory(state, action: PayloadAction<string>) {
      state.songHistory = [
        ...state.songHistory.filter((e) => e !== action.payload),
        action.payload,
      ];
      return state;
    },
    logout(state) {
      state = initialState;
      return state;
    },
  },
});

export default userReducer.reducer;
