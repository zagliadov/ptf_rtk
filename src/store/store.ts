import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { sourceApi } from "./services/sourceApi";
import { userApi } from "./services/userApi";
import { customReportApi } from "./services/customReportApi";
import { reportColumnApi } from "./services/reportColumnApi";
import managerSlice from "./managerSlice";
import filtersSlice from "./filtersSlice";
import reportSlice from "./reportSlice";
import authSlice from "./authSlice";
import columnSlice from "./columnSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["filters", "report"],
};

const rootReducer = combineReducers({
  [sourceApi.reducerPath]: sourceApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [customReportApi.reducerPath]: customReportApi.reducer,
  [reportColumnApi.reducerPath]: reportColumnApi.reducer,
  manager: managerSlice,
  filters: filtersSlice,
  report: reportSlice,
  auth: authSlice,
  column: columnSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(sourceApi.middleware)
      .concat(userApi.middleware)
      .concat(customReportApi.middleware)
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
