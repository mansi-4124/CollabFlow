import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import projectReducer from "./slices/projectSlice";
import boardReducer from "./slices/boardSlice";
import columnReducer from "./slices/columnSlice";
import taskReducer from "./slices/taskSlice";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "project", "board", "column", "task"],
};

const rootReducer = combineReducers({
  user: userReducer,
  project: projectReducer,
  board: boardReducer,
  column: columnReducer,
  task: taskReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
