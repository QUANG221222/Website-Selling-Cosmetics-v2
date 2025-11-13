import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./user/userSlice";
import { cosmeticReducer } from "./cosmetic/cosmeticSlice";
import { adminReducer } from "./admin/adminSlice";
import { cartReducer } from "./cart/cartSlice";
import { orderReducer } from "./order/orderSlice";
import { injectStore } from "../api/axios";

const rootPersistConfig = {
  key: "root", // The key for the root reducer
  storage: storage, 
  whitelist: ["user", "admin"], // user data can store in redux when press f5
};

// Combine all reducers
const reducers = combineReducers({
  user: userReducer,
  admin: adminReducer,
  cosmetic: cosmeticReducer,
  cart: cartReducer,
  order: orderReducer,
});

// Process persist Reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,

  // Fix warning: error when implement redux-persist (NON-SERIALIZABLE : Date, Symbol, Promise)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
        ],
      },
    }),
});

// Inject store to axios for interceptor
injectStore(store);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
