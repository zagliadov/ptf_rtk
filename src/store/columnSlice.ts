import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Endpoints } from "src/constants/endpoint";
import * as _ from "lodash";

interface IFiltersState {
  columns: any;
}

const initialState: IFiltersState = {
  columns: [],
};

export const getReportColumn = createAsyncThunk(
  "report/getReportColumn",
  async (reportId: number) => {
    try {
      const urlParams = new URLSearchParams();
      urlParams.append("filter", `[Report Setting]='${reportId}'`);
      const response = await axios.get(
        `${Endpoints.API_REPORT_COLUMN}/select.json?${urlParams.toString()}`
      );
      const columnsData = response?.data; // Assuming this is an array
      return columnsData;
    } catch (error) {
      console.error("Error in deleteReport", error);
    }
  }
);

const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getReportColumn.pending, (state) => {})
      .addCase(getReportColumn.fulfilled, (state, action) => {
        state.columns = action.payload;
      })
      .addCase(getReportColumn.rejected, (state, action) => {});
  },
});

export const {} = columnSlice.actions;

export default columnSlice.reducer;
