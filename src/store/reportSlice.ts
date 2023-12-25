import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DynamicFormData, EDataKeys, IIFilters } from "src/types";
import { ICreateReport, reportSettingsApi } from "./services/reportSettingsApi";
import { reportColumnApi } from "./services/reportColumnApi";

interface IReportData {
  reportSourceId: EDataKeys.DATA_SOURCE;
  reportType: EDataKeys.INTERNAL | EDataKeys.EXTERNAL | null;
  reportColumnIds: string[];
  reportFilters: any;
}

interface IReportState {
  reportId: number | null;
  reportName: string;
  reportSourceId: string;
  reportType: EDataKeys.INTERNAL | EDataKeys.EXTERNAL | null;
  reportColumnIds: string[];
  reportFilters: any;
  createReportLoading: boolean;
  updateReportLoading: boolean;
  deleteReportLoading: boolean;
  isReportCreated: boolean;
  isReportDelete: boolean;
}

const initialState: IReportState = {
  reportId: null,
  reportName: "",
  reportSourceId: "",
  reportType: EDataKeys.INTERNAL,
  reportColumnIds: [""],
  reportFilters: null,
  createReportLoading: false,
  updateReportLoading: false,
  deleteReportLoading: false,
  isReportCreated: false,
  isReportDelete: false,
};

interface IBasicReportData {
  reportId: number | null;
  reportName: string;
  reportSourceId: string;
  reportType: EDataKeys.INTERNAL | EDataKeys.EXTERNAL;
}

export const createReport = createAsyncThunk(
  "report/createReport",
  async (data: DynamicFormData, { dispatch, rejectWithValue }) => {
    try {
      const reportData: ICreateReport = {
        sourceId: data[EDataKeys.DATA_SOURCE],
        name: data[EDataKeys.REPORT_TITLE],
        type: data[EDataKeys.REPORT_TYPE],
      };
      const reportResult = await dispatch(
        reportSettingsApi.endpoints.createReportSettings.initiate(reportData)
      ).unwrap();
      console.log(reportResult, "reportResult createReportSetting");

      const columnPromises = data[EDataKeys.COLUMN_IDS].map(
        async (columnId: number) => {
          const filterIndex = data[EDataKeys.FILTERED_LIST].findIndex(
            (filter: IIFilters) => String(filter.id) === String(columnId)
          );
          if (filterIndex !== -1) {
            const filterData = data[EDataKeys.FILTERED_LIST][filterIndex];
            const columnData = {
              "Report Setting": reportResult[0].id,
              id: columnId,
              selectedTableCell: filterData[EDataKeys.SELECTED_TABLE_CELL],
              selectedTableFilter: filterData[EDataKeys.SELECTED_TABLE_FILTER],
              disabled: filterData[EDataKeys.DISABLED],
              pinToMainView: filterData[EDataKeys.PIN_TO_MAIN_VIEW],
              name: filterData[EDataKeys.NAME],
              choice: filterData[EDataKeys.CHOICE],
              alias: filterData[EDataKeys.ALIAS],
              description: filterData[EDataKeys.DESCRIPTION],
              type: filterData[EDataKeys.TYPE],
              position: filterIndex,
            };
            const dispatchResult = dispatch(
              reportColumnApi.endpoints.createReportColumn.initiate(columnData)
            ).unwrap();
            return { reportData, dispatchResult };
          }
        }
      );

      const columnResults = await Promise.all(columnPromises);
      console.log("All Columns Created Successfully:", columnResults);

      return reportResult;
    } catch (error) {
      console.error("Error in createReport:", error);
      return rejectWithValue(error);
    }
  }
);

export const deleteReport = createAsyncThunk(
  "report/deleteReport",
  async (
    { reportId, columnIds, update = false }: { reportId: number; columnIds: number[], update?: boolean },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const deleteResult = await dispatch(
        reportSettingsApi.endpoints.deleteReportSettings.initiate(reportId)
      ).unwrap();

      if (deleteResult[0].status === 200) {
        const deleteColumnPromises = columnIds.map((columnId: number) => {
          return dispatch(
            reportColumnApi.endpoints.deleteReportColumn.initiate(columnId)
          ).unwrap();
        });

        const deleteColumnResults = await Promise.all(deleteColumnPromises);
        console.log("All columns deleted:", deleteColumnResults);
      }
      return update
    } catch (error) {
      console.error("Error in deleteReport", error);
      return rejectWithValue(error);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportName(state, action: PayloadAction<string>) {
      state.reportName = action.payload;
    },
    setReportId(state, action: PayloadAction<number | null>) {
      state.reportId = action.payload;
    },
    setReportSourceId(state, action: PayloadAction<string>) {
      state.reportSourceId = action.payload;
    },
    setReportType(
      state,
      action: PayloadAction<EDataKeys.EXTERNAL | EDataKeys.INTERNAL | null>
    ) {
      state.reportType = action.payload;
    },
    setBasicReportData(state, action: PayloadAction<IBasicReportData>) {
      const { reportId, reportName, reportSourceId, reportType } =
        action.payload;
      state.reportId = reportId;
      state.reportName = reportName;
      state.reportSourceId = reportSourceId;
      state.reportType = reportType;
    },
    setReportFilters(state, action: PayloadAction<IIFilters[]>) {
      state.reportFilters = action.payload;
    },
    setReportData(state, action: PayloadAction<IReportData>) {
      const { reportSourceId, reportType, reportColumnIds, reportFilters } =
        action.payload;
      state.reportSourceId = reportSourceId;
      state.reportType = reportType;
      state.reportColumnIds = reportColumnIds;
      state.reportFilters = reportFilters;
    },
    setIsReportCreated(state, action: PayloadAction<boolean>) {
      state.isReportCreated = action.payload;
    },
    setIsReportDelete(state, action: PayloadAction<boolean>) {
      state.isReportDelete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReport.pending, (state) => {
        state.createReportLoading = true;
        state.isReportCreated = false;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.createReportLoading = false;
        state.reportId = action?.payload[0].id;
        state.reportName = action?.meta?.arg[EDataKeys.REPORT_TITLE];
        state.reportSourceId = action?.meta?.arg[EDataKeys.DATA_SOURCE];
        state.reportType = action?.meta?.arg[EDataKeys.REPORT_TYPE];

        state.isReportCreated = true;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.createReportLoading = false;
        state.isReportCreated = false;
      });
    builder
      .addCase(deleteReport.pending, (state) => {
        state.deleteReportLoading = true;
        state.isReportDelete = false;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.deleteReportLoading = false;
        if (action.payload) {
          state.isReportDelete = false;
        } else {
          state.isReportDelete = true;
        }
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.deleteReportLoading = false;
        state.isReportDelete = false;
      });
  },
});

export const {
  setReportName,
  setBasicReportData,
  setReportFilters,
  setReportData,
  setIsReportCreated,
  setIsReportDelete,
  setReportId,
  setReportSourceId,
  setReportType,
} = reportSlice.actions;

export default reportSlice.reducer;
