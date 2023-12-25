import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { sourceApi } from "./services/sourceApi";
import { reportSettingsApi } from "./services/reportSettingsApi";
import { reportColumnApi } from "./services/reportColumnApi";
import managerSlice from "./managerSlice";
import filtersSlice from "./filtersSlice";
import reportSlice from "./reportSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["filters", "report"],
};

const rootReducer = combineReducers({
  [sourceApi.reducerPath]: sourceApi.reducer,
  [reportSettingsApi.reducerPath]: reportSettingsApi.reducer,
  [reportColumnApi.reducerPath]: reportColumnApi.reducer,
  manager: managerSlice,
  filters: filtersSlice,
  report: reportSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(sourceApi.middleware)
      .concat(reportSettingsApi.middleware)
      .concat(reportColumnApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
