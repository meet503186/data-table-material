import { IDataTable } from "../types";
import { getSerialNumber } from "./helper";

export interface IExportData<T extends IDataTable.GenericRecord> {
  rows: T[];
  columns: IDataTable.Column<T>[];
  groups?: IDataTable.Group[];
  filename?: string;
  title?: string;
  getLocalizedText?: (
    text: string,
    params?: IDataTable.GenericRecord
  ) => string;
  paginationData?: IDataTable.Pagination;
  serialNumber?: boolean;
}

class ExportManager {
  public static exportToCSV<T extends IDataTable.GenericRecord>(
    config: IExportData<T>,
    dateTimeStamp: boolean = true
  ) {
    const {
      headers,
      groupHeaders,
      dataRows,
      filename = "table-export",
    } = this.getExportData(config, dateTimeStamp);

    // Convert dynamic colSpan to CSV row
    const groupHeaderRow: string[] = groupHeaders.flatMap((cell: any) => {
      const span = cell.colSpan || 1;
      return [cell.content, ...Array(span - 1).fill("")]; // Fill empty for colspan
    });

    // Escape CSV cells
    const escapeCell = (cell: any) =>
      `"${(cell ?? "").toString().replace(/"/g, '""')}"`;

    const csvContent = (
      groupHeaderRow.length
        ? [
            groupHeaderRow,
            headers.map(escapeCell),
            ...dataRows.map((row) => row.map(escapeCell)),
          ]
        : [
            headers.map(escapeCell),
            ...dataRows.map((row) => row.map(escapeCell)),
          ]
    )
      .map((row) => row.join(","))
      .join("\n");

    // Create Blob and download
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
    config: IExportData<T>,
    dateTimeStamp: boolean = true
  ) {
    const {
      headers,
      groupHeaders,
      dataRows,
      filename = "table-export",
      title = "Table Export",
    } = this.getExportData(config, dateTimeStamp);

    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const pdf = new jsPDF("landscape");
    pdf.setFontSize(16);
    pdf.text(title, 14, 20);

    autoTable(pdf, {
      head: groupHeaders.length ? [groupHeaders, headers] : [headers],
      body: dataRows,
      startY: 30,
      styles: { fontSize: 8, overflow: "linebreak" },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        overflow: "linebreak",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 30 },
      tableWidth: "auto",
      didParseCell: function (data) {
        if (data.section === "head") {
          // First header row (index 0)
          if (data.row.index === 0) {
            data.cell.styles.fillColor = [127, 79, 36]; // Dark brown
            data.cell.styles.textColor = [255, 255, 255]; // White text
            data.cell.styles.fontStyle = "bold";
          }

          // Second header row (index 1)
          if (data.row.index === 1) {
            data.cell.styles.fillColor = [205, 133, 63]; // Light brown
            data.cell.styles.textColor = [0, 0, 0]; // Black text
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    pdf.save(`${filename}.pdf`);
  }

  private static getExportData<T extends IDataTable.GenericRecord>(
    config: IExportData<T>,
    dateTimeStamp: boolean = true
  ) {
    const {
      rows,
      columns,
      groups,
      getLocalizedText,
      paginationData,
      serialNumber,
    } = config;
    const visibleColumns = columns.filter(
      (col) => !col.hidden && !col.hiddenInExport
    );

    const headers = visibleColumns.map(
      (col) => getLocalizedText?.(col.label) || col.label
    );
    const groupHeadersMap = new Map<string, IDataTable.GenericRecord>();
    groups?.length &&
      visibleColumns.forEach((col) => {
        if (!col.groupId) {
          groupHeadersMap.set(col._key, { content: "", colSpan: 1 });
        } else {
          if (groupHeadersMap.has(col.groupId)) {
            groupHeadersMap.set(col.groupId, {
              ...groupHeadersMap.get(col.groupId),
              colSpan: (groupHeadersMap.get(col.groupId)?.colSpan || 0) + 1,
            });
          } else {
            const group = groups.find((g) => g.id === col.groupId);
            groupHeadersMap.set(col.groupId, {
              content: group
                ? getLocalizedText?.(group.label) || group.label
                : "",
              colSpan: 1,
              styles: {
                halign: "center",
              },
            });
          }
        }
      });

    const groupHeaders = Array.from(groupHeadersMap.values());

    const dataRows = this.getFormattedRows(
      rows,
      visibleColumns,
      paginationData,
      serialNumber
    );

    return {
      headers,
      groupHeaders,
      dataRows,
      filename: dateTimeStamp
        ? `${config.filename}-${new Date().toISOString().replace(/[:.]/g, "-")}`
        : config.filename,
      title: config.title,
    };
  }

  private static getFormattedRows<T extends IDataTable.GenericRecord>(
    rows: T[],
    visibleColumns: IDataTable.Column<T>[],
    paginationData?: IDataTable.Pagination,
    serialNumber?: boolean
  ): string[][] {
    return rows.map((row, rowIndex) => {
      const cols = visibleColumns.map((col, colIndex) => {
        if (colIndex === 0 && serialNumber) {
          return getSerialNumber({
            paginationData,
            index: rowIndex,
          }).toString();
        }

        let value = "";

        if (col.renderCell) {
          const rendered = col.renderCell(row, col);
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
      });

      return cols;
    });
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
