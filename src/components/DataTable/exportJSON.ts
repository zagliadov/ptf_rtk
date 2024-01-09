import { AgGridReact } from "ag-grid-react";
import * as fs from "file-saver";

async function exportToJson<T>(gridOptions: AgGridReact<T>, options: { fileName: string }) {
    const colDefs = gridOptions.api.getColumnDefs() as any;
    const { rowsToDisplay }: { rowsToDisplay: { data: T }[] } = gridOptions.api.getModel() as any;
    const data = rowsToDisplay.map(row => row.data);

    // Подготовка данных для экспорта
    const exportData = data.map(row => {
        const exportRow: Record<string, unknown> = {};
        colDefs.forEach((colDef: any) => {
            const cellValue = row[colDef.field as keyof T];
            // Если у столбца есть функция рендеринга, используйте её для получения значения
            if (colDef.cellRenderer) {
                exportRow[colDef.field as string] = colDef.cellRenderer({ value: cellValue });
            } else {
                exportRow[colDef.field as string] = cellValue;
            }
        });
        return exportRow;
    });

    // Преобразование данных в строку JSON
    const jsonString = JSON.stringify(exportData, null, 2);

    // Создание Blob объекта с данными JSON
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });

    // Сохранение файла с использованием file-saver
    fs.saveAs(blob, options.fileName);
}

export default exportToJson;
