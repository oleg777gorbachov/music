import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";
import { createWrapper } from "next-redux-wrapper";

export const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper(() => store);
