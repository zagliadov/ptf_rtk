import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as _ from "lodash";


const addFiltersInfoToPdf = (doc: any, filters: any) => {
  let currentY = 30;
  const fontSize = 8;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - 100; // Учитываем отступы
  const lineHeight = 7; // Увеличенный интервал между строками

  doc.setFontSize(fontSize);

  _.forOwn(filters, (values, key) => {
    if (Array.isArray(values) && values.length > 0) {
      const trimmedValues = values.map(value => {
        if (typeof value === "string" && value.includes("<")) {
          return value.split("<")[0].trim();
        }
        return value;
      });

      let text = `${key}: ${trimmedValues.join(", ")}`;
      let textWidth = doc.getTextWidth(text);

      if (textWidth > maxLineWidth) {
        // Разбиваем текст на несколько строк
        const words = text.split(" ");
        let line = "";

        for (let i = 0; i < words.length; i++) {
          let testLine = line + words[i] + " ";
          let testWidth = doc.getTextWidth(testLine);

          if (testWidth > maxLineWidth && i > 0) {
            doc.text(line, 10, currentY);
            line = words[i] + " ";
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        doc.text(line, 10, currentY);
        currentY += lineHeight;
      } else {
        // Если текст умещается в одну строку
        doc.text(text, 10, currentY);
        currentY += lineHeight;
      }
    }
  });

  return currentY;
};



const addCurrentFiltersInfoToPdf = (doc: any, currentFilters: any, currentY: any) => {
  const fontSize = 8;
  doc.setFontSize(fontSize);

  _.forOwn(currentFilters, (filter, columnName) => {
    let filterTexts = [];

    if (filter.conditions) {
      filterTexts = filter.conditions.map((cond: any) => `${cond.type}: ${cond.filter}`);
    } else if (filter.condition1 || filter.condition2) {
      if (filter.condition1) {
        filterTexts.push(`${filter.condition1.type}: ${filter.condition1.filter}`);
      }
      if (filter.condition2) {
        filterTexts.push(`${filter.condition2.type}: ${filter.condition2.filter}`);
      }
    }

    if (filterTexts.length > 0) {
      const text = `${columnName}: ${filterTexts.join(", ")}`;
      doc.text(text, 10, currentY);
      currentY += 5;
    }
  });

  return currentY;
};


const addReportPopulatedByInfoToPdf = (doc: any, fullName: any, currentY: any) => {
  const fontSize = 8;
  doc.setFontSize(fontSize);
  const text = `Who populated the report: ${fullName}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(text, pageWidth - 20, currentY - 8, { align: 'right' });
  return currentY;
};

const addCreationDateToPdf = (doc: any, currentY: any) => {
  const fontSize = 8;
  doc.setFontSize(fontSize);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).replace(/ /g, ' ');
  const text = `Date of creation: ${formattedDate}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(text, pageWidth - 33, currentY - 4, { align: 'right' });
  return currentY + 10;
};


/**
 * Exports data from Ag-Grid to a PDF file.
 * @param gridOptions - Options of the Ag-Grid.
 * @param options - Settings for the export.
 */
async function exportToPdf(gridOptions: any, options: any) {
  const {
    fileName,
    reportName,
    filters,
    currentFilters,
    fullName,
    maxColumnsPerPage = 5,
    minColumnWidth = 30,
  } = options;
  const colDefs = gridOptions.api.getColumnDefs();
  const rowsToDisplay = gridOptions.api.getModel().rowsToDisplay;
  console.log(currentFilters, "currentFilters")
  // Calculate the total number of parts for each section
  const totalParts = Math.ceil(colDefs.length / maxColumnsPerPage);
  // Create a new PDF document
  const doc = new jsPDF();
  // Define standard margins (if not set explicitly)
  const margins = { left: 10, right: 18 };
  // Function to calculate column width
  const calculateColumnWidth = (numColumns: any) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margins.left - margins.right;
    const columnWidth = usableWidth / numColumns;
    return Math.max(columnWidth, minColumnWidth);
  };

  // Function to create a table with specific columns
  const createTable = (columns: any, data: any, part: any) => {
    const headers = columns.map((colDef: any) => colDef.colId);
    const body = data.map((row: any) =>
      columns.map((colDef: any) => row.data[colDef.field] ?? "")
    );
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
    currentY = addReportPopulatedByInfoToPdf(doc, fullName, currentY);
    currentY = addCreationDateToPdf(doc, currentY);


    // Adding a section header for each part of the table
    autoTable(doc, {
      startY: currentY,
      styles: { fontSize: 6 },
      columnStyles: columnStyles,
    });

    autoTable(doc, {
      styles: { fontSize: 6 },
      columnStyles: columnStyles,
      head: [headers],
      body: body,
      didDrawPage: function (data) {
        // Footer: Add page number
        const str = `Page ${doc.internal.pages.length - 1}`;
        doc.setFontSize(10);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        const pageInfo = `Part ${part} of ${totalParts}`;
        doc.text(str, pageWidth / 2, pageHeight - 10, { align: "center" });
        doc.text(pageInfo, pageWidth - 15, pageHeight - 10, { align: "right" });
        // Add additional footer text
        const additionalFooterText =
          "Marriott Proprietary & Confidential Information";
        doc.text(additionalFooterText, pageWidth / 2 + 2, pageHeight - 2, {align: "center"}); // Adjust the position as needed
      },
    });
  };

  // Splitting data into parts and creating tables
  let sectionNumber = 1;
  for (let i = 0; i < colDefs.length; i += maxColumnsPerPage) {
    const end = i + maxColumnsPerPage;
    const columnsPart = colDefs.slice(i, end);
    createTable(columnsPart, rowsToDisplay, sectionNumber);

    // Adding a new page if it's not the last block of columns
    if (end < colDefs.length) {
      doc.addPage();
    } else {
      sectionNumber++;
    }
  }

  // Save the PDF
  doc.save(fileName);
}

export default exportToPdf;
