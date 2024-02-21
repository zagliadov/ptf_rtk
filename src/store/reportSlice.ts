import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DynamicFormData, EDataKeys, IIFilters } from "src/types";
import { ICreateReport, customReportApi } from "./services/customReportApi";
import { reportColumnApi } from "./services/reportColumnApi";
import { isNameExcluded } from "src/utils/helpers";
import { RootState } from "./store";
import { Endpoints } from "src/constants/endpoint";
import axios from "axios";

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
  isColumnCreated: boolean;
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
  isColumnCreated: false,
};

interface IBasicReportData {
  reportId: number | null;
  reportName: string;
  reportSourceId: string;
  reportType: EDataKeys.INTERNAL | EDataKeys.EXTERNAL;
}

export const createReport = createAsyncThunk(
  "report/createReport",
  async (
    {
      data,
      update = false,
    }: {
      data: DynamicFormData;
      update?: boolean;
    },
    { dispatch, getState, rejectWithValue }
  ): Promise<any> => {
    try {
      const state = getState() as RootState;
      const userEmail = state.auth.userEmail;
      const reportId = state.report.reportId;
      if (!userEmail) return false;
      dispatch(setIsColumnCreated(true));
      if (update && reportId) {
        // Get existing report columns from the database
        const columnUpdateUrl = `${Endpoints.API_REPORT_COLUMN}List%20All/select.json`;
        const columnURLParams = new URLSearchParams();
        columnURLParams.append(
          "filter",
          `[Report Name]='${data[EDataKeys.REPORT_TITLE]}'`
        );
        const findColumnResponse = await axios.get(
          `${columnUpdateUrl}?${columnURLParams.toString()}`
        );
        const reportColumn = findColumnResponse.data;
        const filteredList = data[EDataKeys.FILTERED_LIST];

        // Update existing columns that exist both in the database and on the client
        for (const column of reportColumn) {
          const filteredItem = filteredList.find(
            (item: any) => item.id === Number(column.id)
          );
          if (filteredItem) {
            const updateData = {
              "@row.id": column["@row.id"],
              "Column Position": column["Column Position"],
              choice: filteredItem["choice"],
              pinToMainView: filteredItem["pinToMainView"],
              position: filteredItem["position"],
              selectedTableCell: filteredItem["selectedTableCell"],
              selectedTableFilter: filteredItem["selectedTableFilter"],
            };
            await dispatch(
              reportColumnApi.endpoints.updateReportColumn.initiate(updateData)
            ).unwrap();
          }
        }

        // Create new columns that are not in the database
        for (const item of filteredList) {
          if (
            !reportColumn.some((column: any) => Number(column.id) === item.id)
          ) {
            const columnData = {
              "Report Setting": reportId,
              id: item.id,
              selectedTableCell: item[EDataKeys.SELECTED_TABLE_CELL],
              selectedTableFilter: item[EDataKeys.SELECTED_TABLE_FILTER],
              disabled: item[EDataKeys.DISABLED],
              pinToMainView: item[EDataKeys.PIN_TO_MAIN_VIEW],
              name: item[EDataKeys.NAME],
              choice: item[EDataKeys.CHOICE],
              alias: item[EDataKeys.ALIAS],
              description: item[EDataKeys.DESCRIPTION],
              type: item[EDataKeys.TYPE],
              position: item?.position ? item?.position : null,
            };
            await dispatch(
              reportColumnApi.endpoints.createReportColumn.initiate(columnData)
            ).unwrap();
          }
        }

        // Delete columns that are not on the client
        for (const column of reportColumn) {
          if (
            !filteredList.some((item: any) => item.id === Number(column.id))
          ) {
            await dispatch(
              reportColumnApi.endpoints.deleteReportColumn.initiate(
                column["@row.id"]
              )
            ).unwrap();
          }
        }
        console.log("Updating, creating and deleting columns completed");

        const findUrl = `${Endpoints.API_CUSTOM_REPORT}List%20All/select.json`;
        const urlParams = new URLSearchParams();
        urlParams.append("filter", `[id]='${reportId}'`);

        const findResponse = await axios.get(
          `${findUrl}?${urlParams.toString()}`
        );
        const item = findResponse.data;

        return { item, update };
      } else {
        const reportData: ICreateReport = {
          sourceId: data[EDataKeys.DATA_SOURCE],
          name: data[EDataKeys.REPORT_TITLE],
          type: data[EDataKeys.REPORT_TYPE],
          "Report Creator Email": userEmail,
        };
        const reportResult = await dispatch(
          customReportApi.endpoints.createCustomReport.initiate(reportData)
        ).unwrap();

        const columnPromises = data[EDataKeys.COLUMN_IDS].map(
          async (columnId: number) => {
            const filterIndex = data[EDataKeys.FILTERED_LIST].findIndex(
              (filter: IIFilters) => String(filter.id) === String(columnId)
            );
            if (filterIndex !== -1) {
              const filterData = data[EDataKeys.FILTERED_LIST][filterIndex];
              if (isNameExcluded(filterData.name, data[EDataKeys.DATA_SOURCE]))
                return;
              const columnData = {
                "Report Setting": reportResult[0].id,
                id: columnId,
                selectedTableCell: filterData[EDataKeys.SELECTED_TABLE_CELL],
                selectedTableFilter:
                  filterData[EDataKeys.SELECTED_TABLE_FILTER],
                disabled: filterData[EDataKeys.DISABLED],
                pinToMainView: filterData[EDataKeys.PIN_TO_MAIN_VIEW],
                name: filterData[EDataKeys.NAME],
                choice: filterData[EDataKeys.CHOICE],
                alias: filterData[EDataKeys.ALIAS],
                description: filterData[EDataKeys.DESCRIPTION],
                type: filterData[EDataKeys.TYPE],
                position: filterData?.position
                  ? filterData?.position
                  : null,
                "Column Position": filterData["Column Position"]
              };
              return await dispatch(
                reportColumnApi.endpoints.createReportColumn.initiate(
                  columnData
                )
              ).unwrap();
            }
            return null;
          }
        );

        const columnResults = await Promise.all(columnPromises.filter(Boolean));
        console.log("All Columns Created Successfully:", columnResults);

        return { reportResult, update };
      }
    } catch (error) {
      console.error("Error in createReport:", error);
      return rejectWithValue(error);
    }
  }
);

export const deleteReport = createAsyncThunk(
  "report/deleteReport",
  async (
    {
      reportId,
      columnIds,
      update = false,
      newName,
      newType,
    }: {
      reportId: number;
      columnIds: number[];
      update?: boolean;
      newName?: string;
      newType?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (update && newName && newType) {
        const updateData = {
          "@row.id": reportId,
          name: newName,
          type: newType,
        };
        await dispatch(
          customReportApi.endpoints.updateCustomReport.initiate(updateData)
        ).unwrap();
      } else {
        const deleteColumnPromises = columnIds.map((columnId: number) => {
          return dispatch(
            reportColumnApi.endpoints.deleteReportColumn.initiate(columnId)
          ).unwrap();
        });

        const deleteColumnResults = await Promise.all(deleteColumnPromises);
        console.log("All columns deleted:", deleteColumnResults);
        await dispatch(
          customReportApi.endpoints.deleteCustomReport.initiate(reportId)
        ).unwrap();
      }

      return update;
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
    setIsCreateReportLoading(state, action: PayloadAction<boolean>) {
      state.createReportLoading = action.payload;
    },
    setIsColumnCreated(state, action: PayloadAction<boolean>) {
      state.isColumnCreated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReport.pending, (state) => {
        // state.createReportLoading = true;
        state.isReportCreated = false;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.createReportLoading = false;
        if (action.payload.update) {
          state.reportId = action.payload.item[0]["@row.id"];
          state.reportName = action.payload.item[0].name;
          state.reportSourceId = action.payload.item[0].sourceId;
          state.reportType = action.payload.item[0].type;
        } else {
          state.reportId = action?.payload.reportResult[0].id;
          state.reportName = action?.meta?.arg.data[EDataKeys.REPORT_TITLE];
          state.reportSourceId = action?.meta?.arg.data[EDataKeys.DATA_SOURCE];
          state.reportType = action?.meta?.arg.data[EDataKeys.REPORT_TYPE];
        }
        state.isReportCreated = true;
        state.isColumnCreated = false;
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
  setIsCreateReportLoading,
  setIsColumnCreated,
} = reportSlice.actions;

export default reportSlice.reducer;