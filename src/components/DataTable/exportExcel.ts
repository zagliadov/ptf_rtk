import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Workbook, Column } from "exceljs";
import * as ExcelProper from "exceljs";
import * as fs from "file-saver";
import * as _ from "lodash";

async function exportToExcel<T>(
  gridOptions: AgGridReact<T>,
  options: {
    sheetName: string;
    fileName: string;
    reportName: string;
    filters: any;
    currentFilters: any;
    fullName: string;
  }
) {
  const colDefs = gridOptions.api.getColumnDefs() as ColDef<T>[];
  const { rowsToDisplay }: { rowsToDisplay: { data: T }[] } =
    gridOptions.api.getModel() as any;
  const data = rowsToDisplay.map((row) => row.data);
  const workbook: ExcelProper.Workbook = new Workbook();
  const worksheet = workbook.addWorksheet(options.sheetName);

  let lastRowNumber = 0;
  lastRowNumber++;
  const reportNameRow = worksheet.addRow([options.reportName]);
  reportNameRow.font = {
    bold: true,
    size: 12,
  };
  lastRowNumber++;
  if (!_.isEmpty(options.filters) && _.isEmpty(options.currentFilters)) {
    const filtersAboveTable = worksheet.addRow(["Filters above table:"]);
    filtersAboveTable.font = {
      bold: true,
      size: 11,
    };
    lastRowNumber++;
    const filtersRow = worksheet.getRow(lastRowNumber);
    Object.keys(options.filters).forEach((filterKey, index) => {
      const cell = filtersRow.getCell(index + 1);
      cell.value = filterKey;
      cell.font = {
        bold: true,
      }
    });
    lastRowNumber++;
    Object.values(options.filters).forEach((filterValues: any, colIndex) => {
      filterValues.forEach((value: any, rowIndex: any) => {
        const row = worksheet.getRow(lastRowNumber + rowIndex);
        row.getCell(colIndex + 1).value = value;
      });
    });
    const longestArray = _.maxBy(_.values(options.filters), "length");
    const longestArrayLength = longestArray ? longestArray.length : 0;

    lastRowNumber += longestArrayLength + 1;
    const fullNameRow = worksheet.getRow(lastRowNumber);
    fullNameRow.getCell(1).value = "Who populated the report:";
    fullNameRow.getCell(2).value = options.fullName;
    lastRowNumber++;
    const dateOfCreation = worksheet.getRow(lastRowNumber);
    const now = new Date();
    const formattedDate =
      now.getDate() +
      " " +
      now.toLocaleString("en-us", { month: "short" }) +
      " " +
      now.getFullYear();

    dateOfCreation.getCell(1).value = "Date of creation:";
    dateOfCreation.getCell(2).value = formattedDate;
  }

  if (!_.isEmpty(options.currentFilters) && _.isEmpty(options.filters)) {
    const tableHeaderFilters = worksheet.addRow(["Table header filters:"]);
    tableHeaderFilters.font = {
      bold: true,
      size: 11,
    };
    lastRowNumber++;
    Object.entries(options.currentFilters).forEach(
      ([filterKey, filterValue]: any) => {
        const row = worksheet.getRow(lastRowNumber);
        row.getCell(1).value = filterKey;
        row.getCell(1).font = {
          bold: true,
        }
        if (filterValue.conditions && filterValue.conditions.length) {
          filterValue.conditions.forEach((condition: any, index: any) => {
            row.getCell(2 + index).value =
              `${condition.type}: ${condition.filter}`;
          });
        } else {
          row.getCell(2).value = `${filterValue.type}: ${filterValue.filter}`;
        }
        lastRowNumber++;
      }
    );
    const longestArray = _.maxBy(_.values(options.currentFilters), "length");
    const longestArrayLength = longestArray ? longestArray.length : 0;

    lastRowNumber += longestArrayLength + 1;
    const fullNameRow = worksheet.getRow(lastRowNumber);
    fullNameRow.getCell(1).value = "Who populated the report:";
    fullNameRow.getCell(2).value = options.fullName;
    lastRowNumber++;
    const dateOfCreation = worksheet.getRow(lastRowNumber);
    const now = new Date();
    const formattedDate =
      now.getDate() +
      " " +
      now.toLocaleString("en-us", { month: "short" }) +
      " " +
      now.getFullYear();

    dateOfCreation.getCell(1).value = "Date of creation:";
    dateOfCreation.getCell(2).value = formattedDate;
  }

  //---------------------------------------------------------
  if (!_.isEmpty(options.currentFilters) && !_.isEmpty(options.filters)) {
    const filtersAboveTable = worksheet.addRow(["Filters above table:"]);
    filtersAboveTable.font = {
      bold: true,
      size: 11,
    };
    lastRowNumber++;
    const filtersRow = worksheet.getRow(lastRowNumber);
    Object.keys(options.filters).forEach((filterKey, index) => {
      const cell = filtersRow.getCell(index + 1);
      cell.value = filterKey;
      cell.font = {
        bold: true,
      };
    });
    lastRowNumber++;
    Object.values(options.filters).forEach((filterValues: any, colIndex) => {
      filterValues.forEach((value: any, rowIndex: any) => {
        const row = worksheet.getRow(lastRowNumber + rowIndex);
        row.getCell(colIndex + 1).value = value;
      });
    });
    const longestArray = _.maxBy(_.values(options.filters), "length");
    const longestArrayLength = longestArray ? longestArray.length : 0;
    lastRowNumber += longestArrayLength + 1;

    const tableHeaderFilters = worksheet.addRow(["Table header filters:"]);
    tableHeaderFilters.font = {
      bold: true,
      size: 11,
    };
    Object.entries(options.currentFilters).forEach(
      ([filterKey, filterValue]: any) => {
        const row = worksheet.getRow(lastRowNumber);
        row.getCell(1).value = filterKey;
        row.getCell(1).font = {
          bold: true,
        }
        if (filterValue.conditions && filterValue.conditions.length) {
          filterValue.conditions.forEach((condition: any, index: any) => {
            row.getCell(2 + index).value =
              `${condition.type}: ${condition.filter}`;
          });
        } else {
          row.getCell(2).value = `${filterValue.type}: ${filterValue.filter}`;
        }
        lastRowNumber++;
      }
    );

    const longestCurrentFiltersArray = _.maxBy(
      _.values(options.currentFilters),
      "length"
    );
    const longestCurrentFiltersArrayLength = longestCurrentFiltersArray
      ? longestCurrentFiltersArray.length
      : 0;

    lastRowNumber += longestCurrentFiltersArrayLength + 1;
    const fullNameRow = worksheet.getRow(lastRowNumber);
    fullNameRow.getCell(1).value = "Who populated the report:";
    fullNameRow.getCell(2).value = options.fullName;
    lastRowNumber++;
    const dateOfCreation = worksheet.getRow(lastRowNumber);
    const now = new Date();
    const formattedDate =
      now.getDate() +
      " " +
      now.toLocaleString("en-us", { month: "short" }) +
      " " +
      now.getFullYear();

    dateOfCreation.getCell(1).value = "Date of creation:";
    dateOfCreation.getCell(2).value = formattedDate;
  }

  if (_.isEmpty(options.currentFilters) && _.isEmpty(options.filters)) {
    const fullNameRow = worksheet.getRow(lastRowNumber);
    fullNameRow.getCell(1).value = "Who populated the report:";
    fullNameRow.getCell(2).value = options.fullName;
    lastRowNumber++;
    const dateOfCreation = worksheet.getRow(lastRowNumber);
    const now = new Date();
    const formattedDate =
      now.getDate() +
      " " +
      now.toLocaleString("en-us", { month: "short" }) +
      " " +
      now.getFullYear();

    dateOfCreation.getCell(1).value = "Date of creation:";
    dateOfCreation.getCell(2).value = formattedDate;
  }

  lastRowNumber += 2;
  const headerRow = worksheet.getRow(lastRowNumber);
  colDefs.forEach((col, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = col.headerName || col.field;
    cell.font = {
      bold: true,
    };
  });

  lastRowNumber++;
  data.forEach((rowData: any, rowIndex) => {
    const row = worksheet.getRow(rowIndex + lastRowNumber);
    colDefs.forEach((col, colIndex) => {
      let cellValue = rowData[col.field];

      if (
        typeof cellValue === "string" &&
        cellValue.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/)
      ) {
        const date = new Date(cellValue);
        cellValue = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      row.getCell(colIndex + 1).value = cellValue;
    });
  });

  lastRowNumber += data.length + 1;

  const fullNameRow = worksheet.getRow(lastRowNumber);
  fullNameRow.getCell(1).value =
    "Marriott Proprietary & Confidential Information";

  // Fill data
  data.forEach((row) => {
    const newRow: Record<Partial<keyof T>, unknown> = {} as Record<
      Partial<keyof T>,
      unknown
    >;
    colDefs.forEach((column) => {
      const renderer: ({ value }: { value: unknown }) => string =
        column.cellRenderer;
      newRow[column.colId as keyof T] = renderer({
        value: row[column.colId as keyof T],
      });
    });
    worksheet.addRow(newRow);
  });

  // Set alignment for all rows (wrapText: true for the moment, but can be extended to other properties)
  let rowIndex = 1;
  for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
    worksheet.getRow(rowIndex).alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    };
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
  const blob = new Blob([excelData], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const now = new Date();
  const formattedDate =
    now.getDate() +
    "_" +
    now.toLocaleString("en-us", { month: "short" }) +
    "_" +
    now.getFullYear();
  const fileReportName = `Report_${options.reportName}_${formattedDate}`;

  fs.saveAs(blob, fileReportName);
}

export default exportToExcel;
