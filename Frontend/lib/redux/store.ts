import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./user/userSlice";
import { cosmeticReducer } from "./cosmetic/cosmeticSlice";
import { adminReducer } from "./admin/adminSlice";
import { cartReducer } from "./cart/cartSlice";

const rootPersistConfig = {
  key: "root", // The key for the root reducer
  storage: storageSession, // Use session storage for persisting user data
  whitelist: ["user"], // user data can store in redux when press f5
};

// Combine all reducers
const reducers = combineReducers({
  user: userReducer,
  admin: adminReducer,
  cosmetic: cosmeticReducer,
  cart: cartReducer,
  cart: cartReducer,
});

// Process persist Reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,

  // Fix warning: error when implement redux-persist (NON-SERIALIZABLE : Date, Symbol, Promise)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
