import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as _ from "lodash";
import {
  formatDate,
  formatDateToDDMMMYYYY,
  isISO8601Date,
} from "src/utils/helpers";

const addFiltersInfoToPdf = (doc: any, filters: any) => {
  let currentY = 30;
  const fontSize = 8;
  const headerFontSize = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 15;
  const rightMargin = 100;
  const maxLineWidth = pageWidth - leftMargin - rightMargin;
  const lineHeight = 7;
  doc.setFontSize(headerFontSize);
  doc.setFont(undefined, "bold");
  // Display the "Applied Filters" header with left padding and current Y position
  if (!_.isEmpty(filters)) {
    doc.text("Applied Filters:", leftMargin, currentY);
  }
  // After adding the header, increase currentY to make room for the header
  currentY += lineHeight + 1;
  doc.setFontSize(fontSize);

  _.forOwn(filters, (values, key) => {
    // Check if the array is and contains exactly two elements
    if (Array.isArray(values) && values.length === 2) {
      // Check if both elements are numbers or dates
      const isNumericOrDateValues = values.every(
        (value) => !isNaN(value) || !isNaN(Date.parse(value))
      );
      if (isNumericOrDateValues) {
        // If the condition is met, we combine the values using a dash
        const joinedValues = values.join(" - ");
        values = [joinedValues]; // Update the values array to contain one row with the combined values
      }
    }

    const trimmedValues = values.map((value: any) => {
      if (typeof value === "string" && value.includes("<")) {
        return value.split("<")[0].trim();
      }
      return value;
    });
    const fullText = `${key}: ${trimmedValues.join(",  ")}`;
    const lines = doc.splitTextToSize(fullText, maxLineWidth);

    lines.forEach((line: any, index: any) => {
      if (index === 0) {
        const keyEndIndex = line.indexOf(":");
        const keyText = line.substring(0, keyEndIndex);
        const valueText = line.substring(keyEndIndex);

        doc.setFont(undefined, "bold");
        doc.text(keyText, leftMargin, currentY);

        const keyTextWidth = doc.getTextWidth(keyText);
        doc.setFont(undefined, "normal");
        doc.text(valueText, leftMargin + 0.5 + keyTextWidth, currentY);
      } else {
        doc.setFont(undefined, "normal");
        doc.text(line, leftMargin + 2, currentY);
      }
      currentY += lineHeight;
    });
  });

  return currentY;
};

const addCurrentFiltersInfoToPdf = (
  doc: any,
  currentFilters: any,
  currentY: any
) => {
  const fontSize = 8;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - 100; // Reduce the width of the line for margins
  const lineHeight = 7;
  doc.setFontSize(fontSize);
  _.forOwn(currentFilters, (filter, columnName) => {
    let filterTexts = [];
    if (filter.conditions) {
      filter.conditions.forEach((cond: any) => {
        const conditionText = `${cond.type}: ${cond.filter}`;
        filterTexts.push(conditionText);
      });
    } else {
      if (filter.condition1) {
        filterTexts.push(
          `${filter.condition1.type}: ${filter.condition1.filter}`
        );
      }
      if (filter.condition2) {
        filterTexts.push(
          `${filter.condition2.type}: ${filter.condition2.filter}`
        );
      }
      // Process direct property type and filter
      if (filter.type && filter.filter) {
        filterTexts.push(`${filter.type}: ${filter.filter}`);
      }
    }
    // First, display the columnName in bold
    doc.setFont(undefined, "bold");
    const columnNameText = `${columnName}:  `;
    doc.text(columnNameText, 15, currentY + 5);
    // Calculate the width of the columnName text for correct placement of the rest of the text
    const columnNameWidth = doc.getTextWidth(columnNameText);
    // Combine the condition texts and display them in regular font
    const conditionsText = filterTexts.join(", ");
    doc.setFont(undefined, "normal");
    // Split the condition text into lines if it doesn't fit in one line
    const lines = doc.splitTextToSize(
      conditionsText,
      maxLineWidth - columnNameWidth
    );
    // Display the first line immediately after the columnName
    if (lines.length > 0) {
      doc.text(lines[0], 15 + columnNameWidth, currentY + 5);
      currentY += lineHeight;
    }
    // Display the remaining lines (if any)
    lines.slice(1).forEach((line: any) => {
      doc.text(line, 15, currentY + 5);
      currentY += lineHeight;
    });
  });

  return currentY;
};

const addInitialInfoToPdf = (doc: any, fullName: any) => {
  let currentY = 30;
  const fontSize = 8;
  const lineHeight = 7;
  const rightMargin = 15; // Set the right indent
  doc.setFontSize(fontSize);

  const pageWidth = doc.internal.pageSize.getWidth();
  const firstDate = formatDate(new Date());
  const creatorItem = {
    Creator: fullName,
    "Date Created": firstDate,
  };
  Object.entries(creatorItem).forEach(([key, value]) => {
    // Calculate the X coordinate for the text so that it ends at rightMargin from the right edge
    // First, calculate the width for the value, since it is displayed in normal font
    doc.setFont("helvetica", "normal"); // Set the normal font for the value
    const valueWidth = doc.getTextWidth(value);
    // Now set the key to bold and calculate its width
    doc.setFont("helvetica", "bold"); // Set the bold font for the key
    const keyText = `${key}: `;
    const keyWidth = doc.getTextWidth(keyText);
    const totalTextWidth = keyWidth + valueWidth;
    const textX = pageWidth - totalTextWidth - rightMargin;
    // Display the key in bold
    doc.text(keyText, textX, currentY);
    // Switch to a regular font to display the value
    doc.setFont("helvetica", "normal");
    doc.text(value, textX + keyWidth, currentY);
    currentY += lineHeight; // Move to the next line
  });

  return currentY;
};

/**
 * Exports data from Ag-Grid to a PDF file.
 * @param gridOptions - Options of the Ag-Grid.
 * @param options - Settings for the export.
 */
async function exportToPdf(gridOptions: any, options: any) {
  const {
    reportName,
    filters,
    currentFilters,
    fullName,
    maxColumnsPerPage = 15,
    minColumnWidth = 17,
  } = options;
  // Retrieve column definitions from the grid options. These definitions include the structure and metadata for each column displayed in the grid.
  const colDefs = gridOptions.api.getColumnDefs();
  // Get the rows that are currently displayed in the grid. This includes any filtering or sorting that has been applied.
  const rowsToDisplay = gridOptions.api.getModel().rowsToDisplay;
  // Calculate the total number of parts (or sections) needed to display all columns across multiple pages, given the maximum number of columns per page.
  const totalParts = Math.ceil(colDefs.length / maxColumnsPerPage);
  // Create a new PDF document in landscape orientation to better accommodate wide tables.
  const doc = new jsPDF({
    orientation: "landscape",
  });
  // Define standard margins for the document. These margins apply to the left and right sides of each page, ensuring that content is not printed too close to the edge of the paper.
  const margins = { left: 10, right: 18 };
  // Function to calculate the width of each column based on the number of columns to be displayed on a page and the usable page width.
  // This ensures that columns are evenly distributed across the page.
  const calculateColumnWidth = (numColumns: any) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margins.left - margins.right;
    // Divide the usable width by the number of columns to determine the width of each column.
    // The Math.max function ensures that the column width does not fall below a minimum threshold, ensuring readability.
    const columnWidth = usableWidth / numColumns;
    return Math.max(columnWidth, minColumnWidth);
  };

  // Function to create a table with specific columns
  const createTable = (columns: any, data: any, part: any) => {
    const headers = columns.map((colDef: any) => colDef.colId);
    const body = data.map((row: any) => {
      return columns.map((colDef: any) => {
        let cellValue = row.data[colDef.field];
        // Check if the cell value is a string that matches the ISO 8601 date format
        if (typeof cellValue === "string" && isISO8601Date(cellValue)) {
          const date = new Date(cellValue);
          cellValue = formatDateToDDMMMYYYY(date);
        }
        return cellValue ?? "";
      });
    });

    const columnWidth = calculateColumnWidth(columns.length);

    // Define column styles with calculated width
    const columnStyles = {};
    columns.forEach((_: any, index: any) => {
      columnStyles[index] = { cellWidth: columnWidth };
    });
    doc.setFontSize(14);
    doc.text(reportName, doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });
    let currentY = addFiltersInfoToPdf(doc, filters);
    currentY = addCurrentFiltersInfoToPdf(doc, currentFilters, currentY);
    if (currentY === 30) {
      currentY = addInitialInfoToPdf(doc, fullName);
    }
    addInitialInfoToPdf(doc, fullName);
    // Adding a section header for each part of the table
    autoTable(doc, {
      startY: currentY + 10,
      styles: { fontSize: 6 },
      columnStyles: columnStyles,
    });

    autoTable(doc, {
      styles: { fontSize: 6 },
      columnStyles: columnStyles,
      headStyles: { fillColor: [0, 164, 180], textColor: 255 },
      head: [headers],
      body: body,
      didDrawPage: function (data) {
        // Footer: Add page number
        const str = `Page ${doc.internal.pages.length - 1}`;
        doc.setFontSize(6);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        const pageInfo = `Part ${part} ${
          body.length > 0 ? "of " + totalParts : " "
        }`;
        doc.text(str, pageWidth / 2, pageHeight - 10, { align: "center" });
        doc.text(pageInfo, pageWidth - 15, pageHeight - 10, { align: "right" });
        // Add additional footer text
        const additionalFooterText =
          "Marriott Proprietary & Confidential Information";
        doc.setFontSize(5);
        doc.text(additionalFooterText, pageWidth / 2 + 2, pageHeight - 7, {
          align: "center",
        }); // Adjust the position as needed
      },
    });
  };

  // Splitting data into parts and creating tables
  let sectionNumber = 1; // Start from the first part
  for (let i = 0; i < colDefs.length; i += maxColumnsPerPage) {
    const end = Math.min(i + maxColumnsPerPage, colDefs.length); // Make sure we don't go beyond the array
    const columnsPart = colDefs.slice(i, end);
    createTable(columnsPart, rowsToDisplay, sectionNumber);

    // Check if the current block is the last one
    if (end < colDefs.length) {
      doc.addPage(); // Add a new page if this is not the last block of columns
      sectionNumber++; // Increase the part number only when adding a new page
    }
  }

  const now = new Date();
  const formattedDate =
    now.getDate() +
    "_" +
    now.toLocaleString("en-us", { month: "short" }) +
    "_" +
    now.getFullYear();
  const fileReportName = `Report_${options.reportName}_${formattedDate}`;
  // Save the PDF
  doc.save(fileReportName);
}

export default exportToPdf;
