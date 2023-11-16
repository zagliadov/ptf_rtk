import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IManagerState {
  isCreateNewReportOpen: boolean;
  isColumnSelectorOpen: boolean;
  isFiltersOpen: boolean;
  isSaveNewReportOpen: boolean;
  isDeleteEntryOpen: boolean;
  isSideMenuOpen: boolean;
  isReportsOpen: boolean;
  isDotThreeMenuOpen: boolean;
}

const initialState: IManagerState = {
  isCreateNewReportOpen: false,
  isColumnSelectorOpen: false,
  isFiltersOpen: false,
  isSaveNewReportOpen: false,
  isDeleteEntryOpen: false,
  isSideMenuOpen: true,
  isReportsOpen: false,
  isDotThreeMenuOpen: false,
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    setCreateNewReportOpen(state, action: PayloadAction<boolean>) {
      state.isCreateNewReportOpen = action.payload;
    },
    setColumnSelectorOpen(state, action: PayloadAction<boolean>) {
      state.isColumnSelectorOpen = action.payload;
    },
    setIsFiltersOpen(state, action: PayloadAction<boolean>) {
      state.isFiltersOpen = action.payload;
    },
    setIsSaveNewReportOpen(state, action: PayloadAction<boolean>) {
      state.isSaveNewReportOpen = action.payload;
    },
    setIsDeleteEntryOpen(state, action: PayloadAction<boolean>) {
      state.isDeleteEntryOpen = action.payload;
    },
    setIsSideMenuOpen(state, action: PayloadAction<boolean>) {
      state.isSideMenuOpen = action.payload;
    },
    setIsReportsOpen(state, action: PayloadAction<boolean>) {
      state.isReportsOpen = action.payload;
    },
    setIsDotThreeMenuOpen(state, action: PayloadAction<boolean>) {
      state.isDotThreeMenuOpen = action.payload;
    }
  },

  extraReducers: () => {},
});

export const {
  setCreateNewReportOpen,
  setColumnSelectorOpen,
  setIsFiltersOpen,
  setIsSaveNewReportOpen,
  setIsDeleteEntryOpen,
  setIsSideMenuOpen,
  setIsReportsOpen,
  setIsDotThreeMenuOpen,
} = managerSlice.actions;

export default managerSlice.reducer;
