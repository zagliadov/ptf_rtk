import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exports data from Ag-Grid to a PDF file.
 * @param gridOptions - Options of the Ag-Grid.
 * @param options - Settings for the export.
 */
async function exportToPdf(gridOptions: any, options: any): Promise<void> {
  const { fileName } = options;
  const colDefs = gridOptions.api.getColumnDefs();
  const rowsToDisplay = gridOptions.api.getModel().rowsToDisplay;
  // Create a new PDF document
  const doc = new jsPDF();
  // Get column headers
  const headers = colDefs.map((colDef: any) => colDef.headerName);
  // Get row data
  const data = rowsToDisplay.map((row: any) => {
    return colDefs.map((colDef: any) => {
      const value = row.data[colDef.field];
      return value != null ? value.toString() : "";
    });
  });
  // Add table to the document
  autoTable(doc, {
    head: [headers],
    body: data,
  });
  // Save the PDF
  doc.save(fileName);
}

export default exportToPdf;
