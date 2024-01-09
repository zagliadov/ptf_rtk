import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports data from Ag-Grid to a PDF file.
 * @param gridOptions - Options of the Ag-Grid.
 * @param options - Settings for the export.
 */
async function exportToPdf(gridOptions: any, options: any) {
  const { fileName, maxColumnsPerPage = 5, minColumnWidth = 30 } = options;
  const colDefs = gridOptions.api.getColumnDefs();
  const rowsToDisplay = gridOptions.api.getModel().rowsToDisplay;

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
  const createTable = (columns: any, data: any, section: any, part: any) => {
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

    // Adding a section header for each part of the table
    autoTable(doc, {
      head: [[`Section ${section}, Part ${part} of ${totalParts}`]],
      theme: "plain",
      styles: { halign: "center", fillColor: [255, 255, 255] },
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
        const pageInfo = `Section ${section}, Part ${part} of ${totalParts}`;
        doc.text(str, pageWidth / 2, pageHeight - 10, { align: "center" });
        doc.text(pageInfo, pageWidth - 15, pageHeight - 10, { align: "right" });
      },
    });
  };

  // Splitting data into parts and creating tables
  let sectionNumber = 1;
  let partNumber = 1;
  for (let i = 0; i < colDefs.length; i += maxColumnsPerPage) {
    const end = i + maxColumnsPerPage;
    const columnsPart = colDefs.slice(i, end);
    createTable(columnsPart, rowsToDisplay, sectionNumber, partNumber);

    // Adding a new page if it's not the last block of columns
    if (end < colDefs.length) {
      doc.addPage();
      partNumber++;
    } else {
      sectionNumber++;
      partNumber = 1; // Reset part number for new section
    }
  }

  // Save the PDF
  doc.save(fileName);
}

export default exportToPdf;