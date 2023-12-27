import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IManagerState {
  isCreateNewReportOpen: boolean;
  isColumnSelectorOpen: boolean;
  isFiltersOpen: boolean;
  isEditReportOpen: boolean;
  isEditColumnSelectorOpen: boolean;
  isEditFiltersOpen: boolean;
  isDeleteEntryOpen: boolean;
  isSideMenuOpen: boolean;
  isDotThreeMenuOpen: boolean;
  isUnsavedChanges: boolean;
  isSaveFiltersChangesOpen: boolean;
  isDeleteReport: boolean;
  isCreateReport: boolean;
}

const initialState: IManagerState = {
  isCreateNewReportOpen: false,
  isColumnSelectorOpen: false,
  isFiltersOpen: false,
  isEditReportOpen: false,
  isEditColumnSelectorOpen: false,
  isEditFiltersOpen: false,
  isDeleteEntryOpen: false,
  isSideMenuOpen: true,
  isDotThreeMenuOpen: false,
  isUnsavedChanges: false,
  isSaveFiltersChangesOpen: false,
  isDeleteReport: false,
  isCreateReport: false,
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
    setReportEditOpen(state, action: PayloadAction<boolean>) {
      state.isEditReportOpen = action.payload;
    },
    setEditColumnSelectorOpen(state, action: PayloadAction<boolean>) {
      state.isEditColumnSelectorOpen = action.payload;
    },
    setIsEditFiltersOpen(state, action: PayloadAction<boolean>) {
      state.isEditFiltersOpen = action.payload;
    },
    setIsDeleteEntryOpen(state, action: PayloadAction<boolean>) {
      state.isDeleteEntryOpen = action.payload;
    },
    setIsSideMenuOpen(state, action: PayloadAction<boolean>) {
      state.isSideMenuOpen = action.payload;
    },
    setIsDotThreeMenuOpen(state, action: PayloadAction<boolean>) {
      state.isDotThreeMenuOpen = action.payload;
    },
    setIsUnsavedChanges(state, action: PayloadAction<boolean>) {
      state.isUnsavedChanges = action.payload;
    },
    setIsSaveFiltersChangesOpen(state, action: PayloadAction<boolean>) {
      state.isSaveFiltersChangesOpen = action.payload;
    },
    setIsDeleteReport(state, action: PayloadAction<boolean>) {
      state.isDeleteReport = action.payload;
    },
    setIsCreateReport(state, action: PayloadAction<boolean>) {
      state.isCreateReport = action.payload;
    }
  },

  extraReducers: () => {},
});

export const {
  setCreateNewReportOpen,
  setColumnSelectorOpen,
  setIsFiltersOpen,
  setReportEditOpen,
  setEditColumnSelectorOpen,
  setIsEditFiltersOpen,
  setIsDeleteEntryOpen,
  setIsSideMenuOpen,
  setIsDotThreeMenuOpen,
  setIsUnsavedChanges,
  setIsSaveFiltersChangesOpen,
  setIsDeleteReport,
  setIsCreateReport,
} = managerSlice.actions;

export default managerSlice.reducer;
