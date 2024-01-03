import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Workbook, Column } from "exceljs";
import * as ExcelProper from "exceljs";
import * as fs from "file-saver";

async function exportToExcel<T>(gridOptions: AgGridReact<T>, options: { sheetName: string, fileName: string }) {
    const colDefs = gridOptions.api.getColumnDefs() as ColDef<T>[];
    const { rowsToDisplay }: { rowsToDisplay: { data: T }[] } = gridOptions.api.getModel() as any;
    const data = rowsToDisplay.map(row => row.data);

    const workbook: ExcelProper.Workbook = new Workbook();
    const worksheet = workbook.addWorksheet(options.sheetName);
    worksheet.columns = colDefs.map((column) => {
        console.log(column, "column.headerName");
        const headerCol: Partial<Column> = {
            header: column.colId,
            key: column.colId,
        };
        return headerCol;
    });

    // Fill data
    data.forEach((row) => {
        const newRow: Record<Partial<keyof T>, unknown> = {} as Record<Partial<keyof T>, unknown>;
        colDefs.forEach((column) => {
            const renderer: ({ value }: { value: unknown }) => string = column.cellRenderer;
            newRow[column.colId as keyof T] = renderer({ value: row[column.colId as keyof T] });
        });
        worksheet.addRow(newRow);
    });

    // Set alignment for all rows (wrapText: true for the moment, but can be extended to other properties)
    let rowIndex = 1;
    for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
        worksheet.getRow(rowIndex).alignment = { vertical: "top", horizontal: "left", wrapText: true };
    }

    worksheet.columns.forEach(function (column) {
        let maxLength = 0;
        column["eachCell"]?.({ includeEmpty: true }, function (cell) {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength; //eslint-disable-line
    });

    // Save file
    const excelData = await workbook.xlsx.writeBuffer();
    const blob = new Blob([excelData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    fs.saveAs(blob, options.fileName);

}

export default exportToExcel;