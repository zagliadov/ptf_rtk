import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


import { ColDef, ColGroupDef, RowClickedEvent } from 'ag-grid-community'
import {
    GridReadyEvent,
} from "ag-grid-community/dist/lib/events";

import {
    ColumnState,
} from "ag-grid-community/dist/lib/columns/columnModel";


import classNames from "classnames/bind";
import styles from "./DataTable.module.scss";
import Tooltip from "./Tooltip";
import exportToExcel from "./exportExcel";
import exportToPdf from "./exportPDF";
import exportToJson from "./exportJSON";

const cx: CX = classNames.bind(styles);

type Props<T> = {
    rows?: T[],
    columnDefs?: (ColDef<T, any> |  ColGroupDef<T>)[] | null,
    onRowClick: (data: T) => unknown,
    onRecordsNumberChanged: (recordsNumber: number) => void
    defaultSortModel?: ColumnState[],
    excelName?: string,
    pdfName?: string,
}

export type TableRef = {
    resetFilters: () => void,
    exportExcel: () => void,
    exportPdf: () => void,
    exportJSON: () => void,
}

function DataTable<T>(props: Props<T>, ref: React.ForwardedRef<TableRef>) {
    const { columnDefs, rows, onRowClick, onRecordsNumberChanged, excelName, pdfName } = props;

    const gridRef = useRef<AgGridReact<T>>();

    useImperativeHandle(ref, // forwarded ref
        () => ({
            resetFilters: () => {
                if(gridRef.current) {
                    gridRef?.current.api.setFilterModel(null);
                }
            },
            exportExcel: () => {
                if(gridRef.current && excelName) {
                    void exportToExcel(gridRef.current, { sheetName: excelName, fileName: excelName });
                }
            },
            exportPdf: () => {
                if (gridRef.current) {
                    void exportToPdf(gridRef.current, { fileName: `${pdfName}.pdf` });
                }
            },
            exportJSON: () => {
                if (gridRef.current) {
                    console.log(gridRef.current, "gridRef.current")
                    void exportToJson(gridRef.current, { fileName: "report" });
                }
            },
        }), [excelName, pdfName]);

    const defaultColDef = useMemo<ColDef<T, unknown>>(() => ({
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
    }), []);

    const getRowClass = () => {
        return cx("agg-row-cell");
    };

    const getRowHeight = useCallback(
        (): number | undefined | null => {
            return 60;
        },
        [],
    );

    const onGridReady = (event: GridReadyEvent<T, any>) => {

        if (props.defaultSortModel) {

            event.columnApi.applyColumnState({ state: props.defaultSortModel });
        }
    };

    const onModelUpdated = () => {
        if(onRecordsNumberChanged && gridRef.current) {
            onRecordsNumberChanged(gridRef.current.api.getDisplayedRowCount());
        }
    };

    return (
        <div className={cx("wrapper", "ag-theme-alpine ag-root-wrapper")}>
            <AgGridReact<T>
                ref={gridRef as any}
                onModelUpdated={onModelUpdated}
                rowData={rows}
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
                // onRowClicked={((event: RowClickedEvent<T, any>) => { if(event.data) onRowClick(event.data); }) as any}
            />
        </div>
    );
}

const DataTableRef = forwardRef(DataTable) as <T>(
    props: Props<T> & { ref?: React.ForwardedRef<TableRef> }
) => ReturnType<typeof DataTable>;

export default DataTableRef;
