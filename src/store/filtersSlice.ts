import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EDataKeys, IIFilters } from "src/types";

interface IFiltersState {
  selectedFilters: IIFilters[];
  filterArray: IIFilters[];
  reportTitle: EDataKeys.REPORT_TITLE | null;
  dataSource: EDataKeys.DATA_SOURCE | null;
  reportType: EDataKeys.REPORT_TYPE | null;
  reportId: number | null;
}

const initialState: IFiltersState = {
  selectedFilters: [],
  filterArray: [],
  reportTitle: null,
  dataSource: null,
  reportType: null,
  reportId: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedFilters(state, action: PayloadAction<IIFilters[]>) {
      state.selectedFilters = action.payload;
      localStorage.setItem("selectedFilters", JSON.stringify(action.payload));
    },
    setFilterArray(state, action: PayloadAction<IIFilters[]>) {
      localStorage.setItem("filtersArray", JSON.stringify(action.payload));
    },
    /**
     * Updates multiple fields of the IFiltersState.
     * @param {IFiltersState} state - The current state of the filters.
     * @param {PayloadAction<{
     *   reportTitle?: EDataKeys.REPORT_TITLE,
     *   dataSource?: EDataKeys.DATA_SOURCE,
     *   reportType?: EDataKeys.REPORT_TYPE
     * }>} action - The action payload containing the fields to be updated.
     */
    setReportData(
      state,
      action: PayloadAction<{
        reportTitle?: EDataKeys.REPORT_TITLE;
        dataSource?: EDataKeys.DATA_SOURCE;
        reportType?: EDataKeys.REPORT_TYPE;
      }>
    ) {
      const { reportTitle, dataSource, reportType } = action.payload;
      if (reportTitle !== undefined) state.reportTitle = reportTitle;
      if (dataSource !== undefined) state.dataSource = dataSource;
      if (reportType !== undefined) state.reportType = reportType;
    },
    setReportId(state, action: PayloadAction<number>) {
      state.reportId = action.payload;
    },
  },

  extraReducers: () => {},
});

export const { setSelectedFilters, setReportData, setReportId, setFilterArray } =
  filtersSlice.actions;

export default filtersSlice.reducer;
