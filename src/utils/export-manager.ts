import { IDataTable } from "../types";

export interface IExportData<T extends IDataTable.GenericRecord> {
  rows: T[];
  columns: IDataTable.Column<T>[];
  filename?: string;
  title?: string;
  getLocalizedText?: (
    text: string,
    params?: IDataTable.GenericRecord
  ) => string;
}

class ExportManager {
  public static exportToCSV<T extends IDataTable.GenericRecord>(
    config: IExportData<T>
  ) {
    const {
      headers,
      dataRows,
      filename = "table-export",
    } = this.getExportData(config);

    const csvContent = [headers, ...dataRows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public static async exportToPDF<T extends IDataTable.GenericRecord>(
    config: IExportData<T>
  ) {
    const {
      headers,
      dataRows,
      filename = "table-export",
      title = "Table Export",
    } = this.getExportData(config);

    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const pdf = new jsPDF("landscape");
    pdf.setFontSize(16);
    pdf.text(title, 14, 20);

    autoTable(pdf, {
      head: [headers],
      body: dataRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 30 },
    });

    pdf.save(`${filename}.pdf`);
  }

  private static getExportData<T extends IDataTable.GenericRecord>(
    config: IExportData<T>
  ) {
    const { rows, columns, getLocalizedText } = config;
    const visibleColumns = columns.filter(
      (col) => !col.hidden && !col.hiddenInExport
    );
    const headers = visibleColumns.map(
      (col) => getLocalizedText?.(col.label) || col.label
    );
    const dataRows = this.getFormattedRows(rows, visibleColumns);

    return {
      headers,
      dataRows,
      filename: config.filename,
      title: config.title,
    };
  }

  private static getFormattedRows<T extends IDataTable.GenericRecord>(
    rows: T[],
    visibleColumns: IDataTable.Column<T>[]
  ): string[][] {
    return rows.map((row) =>
      visibleColumns.map((col) => {
        let value = "";

        if (col.renderCell) {
          const rendered = col.renderCell(row);
          if (typeof rendered === "string" || typeof rendered === "number") {
            value = String(rendered);
          } else {
            value = ExportManager.getCleanTextValue(row[col._key]);
          }
        } else {
          value = ExportManager.getCleanTextValue(row[col._key]);
        }

        const stringValue = String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
    );
  }

  private static getCleanTextValue(value: unknown): string {
    if (value === null || value === undefined) return "";

    if (typeof value === "string" || typeof value === "number")
      return String(value);

    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (typeof value === "object") {
      if (
        value &&
        typeof (value as { toString?: () => string }).toString === "function"
      ) {
        return (value as { toString: () => string }).toString();
      }
      return JSON.stringify(value);
    }

    return String(value);
  }
}

export default ExportManager;
