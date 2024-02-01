import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef, ColGroupDef, RowClickedEvent } from "ag-grid-community";
import { GridReadyEvent } from "ag-grid-community/dist/lib/events";
import * as _ from "lodash";

import { ColumnState } from "ag-grid-community/dist/lib/columns/columnModel";

import classNames from "classnames/bind";
import styles from "./DataTable.module.scss";
import Tooltip from "./Tooltip";
import exportToExcel from "./exportExcel";
import exportToPdf from "./exportPDF";
import { format, parseISO, isValid } from "date-fns";
import { RootState, useAppDispatch, useAppSelector } from "src/store/store";
import { Endpoints } from "src/constants/endpoint";
import axios from "axios";
import { getReportColumn } from "src/store/columnSlice";
import { useGetReportQuery } from "src/store/services/customReportApi";
import { setIsNotReportCreator } from "src/store/managerSlice";

const cx: CX = classNames.bind(styles);

const isISODateString = (value: any) => {
  if (typeof value !== "string") return false;
  const date = parseISO(value);
  return isValid(date);
};

const dateFormatter = (params: any) => {
  if (!params.value || !isISODateString(params.value)) return params.value;
  return format(parseISO(params.value), "dd MMM yyyy");
};

type Props<T> = {
  rows?: T[];
  columnDefs?: (ColDef<T, any> | ColGroupDef<T>)[] | null;
  onRowClick: (data: T) => unknown;
  onRecordsNumberChanged: (recordsNumber: number) => void;
  defaultSortModel?: ColumnState[];
  excelName?: string;
  pdfName?: string;
  reportName: string;
  filters: any;
  fullName: string;
  columnArray: any;
};

export type TableRef = {
  resetFilters: () => void;
  exportExcel: () => void;
  exportPdf: () => void;
};

function DataTable<T>(props: Props<T>, ref: React.ForwardedRef<TableRef>) {
  const {
    columnDefs,
    rows,
    onRowClick,
    onRecordsNumberChanged,
    excelName,
    pdfName,
    reportName,
    filters,
    fullName,
    columnArray,
  } = props;

  const gridRef = useRef<AgGridReact<T>>();
  const { reportId } = useAppSelector((state: RootState) => state.report);
  const { userResources, userEmail } = useAppSelector(
    (state: RootState) => state.auth
  );
  const { data } = useGetReportQuery(Number(reportId));
  const dispatch = useAppDispatch();
  const getCurrentFilters = () => {
    if (gridRef.current) {
      return gridRef.current?.api?.getFilterModel();
    }
    return {};
  };

  useImperativeHandle(
    ref, // forwarded ref
    () => ({
      resetFilters: () => {
        if (gridRef.current) {
          gridRef?.current.api.setFilterModel(null);
        }
      },
      exportExcel: () => {
        if (gridRef.current && excelName) {
          const currentFilters = getCurrentFilters();
          void exportToExcel(gridRef.current, {
            sheetName: excelName,
            fileName: excelName,
            reportName: reportName,
            filters: filters,
            currentFilters: currentFilters,
            fullName: fullName,
          });
        }
      },
      exportPdf: () => {
        if (gridRef.current) {
          const currentFilters = getCurrentFilters();
          void exportToPdf(gridRef.current, {
            fileName: `${pdfName}.pdf`,
            reportName,
            filters,
            currentFilters: currentFilters,
            fullName,
          });
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [excelName, pdfName, filters, fullName]
  );

  if (columnDefs) {
    columnDefs.forEach((colDef) => {
      if ("field" in colDef) {
        colDef.valueFormatter = dateFormatter;
      }
    });
  }

  const defaultColDef = useMemo<ColDef<T, unknown>>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      unSortIcon: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      headerClass: cx("agg-header-cell"),
      wrapText: true,
      cellEditorPopup: true,
      flex: 1,
      minWidth: 100,
      tooltipComponent: Tooltip,
    }),
    []
  );

  const getRowClass = () => {
    return cx("agg-row-cell");
  };

  const getRowHeight = useCallback((): number | undefined | null => {
    return 60;
  }, []);

  const onGridReady = async (event: GridReadyEvent<T, any>) => {
    await dispatch(getReportColumn(Number(reportId)));
    // Assuming 'columns' is available here and is the array you want to sort
    if (columnArray) {
      // Sort the columns based on "Column Position"
      const sortedColumnState = [...columnArray].sort(
        (a, b) => a["Column Position"] - b["Column Position"]
      );
      // Apply the sorted state to the grid
      event.columnApi.applyColumnState({
        state: sortedColumnState.map((column) => ({
          colId: column.name, // Assuming 'id' is the identifier for your columns
          order: column["Column Position"],
        })),
        applyOrder: true,
      });
    }

    // Apply default sort model if it exists
    if (props.defaultSortModel) {
      event.columnApi.applyColumnState({ state: props.defaultSortModel });
    }
  };

  useEffect(() => {
    const fetchAndApplyColumnState = async () => {
      const { payload } = await dispatch(getReportColumn(Number(reportId)));
      // Assuming 'columnArray' is updated in the Redux store and mapped to this component's props
      if (payload) {
        // Sort the columns based on "Column Position"
        const sortedColumnState = [...payload].sort(
          (a, b) => a["Column Position"] - b["Column Position"]
        );
        // Apply the sorted state to the grid
        if (gridRef.current && gridRef.current.api) {
          gridRef.current.api.setColumnDefs(columnDefs || []);
          gridRef.current.columnApi.applyColumnState({
            state: sortedColumnState.map((column) => ({
              colId: column.name, // Assuming 'name' is the identifier for your columns
              order: column["Column Position"],
            })),
            applyOrder: true,
          });
        }
      }
    };

    fetchAndApplyColumnState();
  }, [columnDefs, dispatch, reportId, reportName]);

  const onModelUpdated = () => {
    if (onRecordsNumberChanged && gridRef.current) {
      onRecordsNumberChanged(gridRef.current.api.getDisplayedRowCount());
    }
  };

  const removeEmailsFromRows = (rows: any) =>
    rows.map((row: any) => {
      const processedRow = {};
      Object.keys(row).forEach((key) => {
        const value = row[key];
        processedRow[key] =
          typeof value === "string"
            ? typeof value === "string"
              ? value?.replace(/<.*?>/, "").trim()
              : ""
            : value;
      });

      return processedRow;
    });

  const handleColumnMoved = async (e: any) => {
    const allColumns =
      gridRef.current && gridRef.current.api.getAllDisplayedColumns();
    await dispatch(getReportColumn(Number(reportId)));
    if (_.isEmpty(columnArray)) return;
    const columnsData = columnArray;

    const columnState =
      allColumns &&
      allColumns.map((col, index) => ({
        colId: col.getColId(),
        "Column Position": index,
      }));

    const updateDataArray = (columnState || [])
      .map((colState) => {
        const columnData = columnsData.find(
          (column: any) => column.name === colState.colId
        );
        return {
          "Report Setting": reportId,
          "@row.id": columnData ? columnData["@row.id"] : null,
          "Column Position": colState["Column Position"],
        };
      })
      .filter((updateData) => updateData["@row.id"] != null); // Filter out any items without a valid "@row.id"
    if (_.isEmpty(data)) return;
    const { email } = userResources.find(
      (resource: any) => resource.email === data[0]["Report Creator Email"]
    );
    if (email === userEmail) {
      try {
        // Ensure updateDataArray is always an array, even if it's empty
        const updatePromises = updateDataArray.map((updateData) => {
          return axios.post(
            `${Endpoints.API_REPORT_COLUMN}/upsert.json`,
            updateData
          );
        });

        await Promise.all(updatePromises);
        console.log("All updates completed");
      } catch (error) {
        console.error("Error during updates:", error);
      }
    } else {
      dispatch(setIsNotReportCreator(true));
    }
  };

  const processedRows = useMemo(() => removeEmailsFromRows(rows), [rows]);

  return (
    <div className={cx("wrapper", "ag-theme-alpine ag-root-wrapper")}>
      <AgGridReact<T>
        ref={gridRef as any}
        onModelUpdated={onModelUpdated}
        rowData={processedRows}
        rowDragManaged
        animateRows
        getRowClass={getRowClass}
        getRowHeight={getRowHeight}
        onGridReady={onGridReady}
        defaultColDef={defaultColDef as any}
        columnDefs={columnDefs}
        tooltipShowDelay={0}
        tooltipHideDelay={2000}
        rowSelection="single"
        colResizeDefault="shift"
        onDragStopped={handleColumnMoved}
        // onRowClicked={((event: RowClickedEvent<T, any>) => { if(event.data) onRowClick(event.data); }) as any}
      />
    </div>
  );
}

const DataTableRef = forwardRef(DataTable) as <T>(
  props: Props<T> & { ref?: React.ForwardedRef<TableRef> }
) => ReturnType<typeof DataTable>;

export default DataTableRef;
