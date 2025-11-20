// ** MUI Imports
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {
  Button,
  Checkbox,
  Paper,
  Stack,
  Toolbar,
  useTheme,
} from "@mui/material";
import { IDataTable } from "../types";
import CustomPagination from "./CustomPagination";
import "./style.css";
import RenderRow from "./RenderRow";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ExportManager from "../utils/export-manager";
import { useCallback, useMemo } from "react";
import { useGroupedColumns } from "../hooks/useGroupedColumns";
import RenderHeaders from "./RenderHeaders";
import RenderGroupHeaders from "./RenderGroupHeaders";
import { getSerialNumber } from "../utils/helper";
import { SERIAL_NUMBER_COLUMN } from "../constants";

/**
 * A generic, reusable DataTable component for rendering tabular data with optional features
 * such as pagination, expandable rows, and additional columns. The component is highly customizable
 * and supports localization, dynamic column visibility, and resizable columns.
 *
 * @template T - The type of the data rows, extending `Record<string, any>`.
 *
 * @param {IDataTable.Props<T>} props - The props for the DataTable component.
 * @param {boolean} [props.serialNumber] - Whether to display a serial number column.
 * @param {T[]} props.rows - The data rows to be displayed in the table.
 * @param {IDataTable.Column[]} props.columns - The column definitions for the table.
 * @param {boolean} [props.pagination=false] - Whether to enable pagination.
 * @param {IDataTable.PaginationData} [props.paginationData] - The pagination data, if pagination is enabled.
 * @param {(data: IDataTable.PaginationData) => void} [props.onChangePaginationData] - Callback for handling pagination changes.
 * @param {IDataTable.AdditionalColumn[]} [props.additionalColumns] - Additional columns to be appended to the table.
 * @param {(row: T) => void} [props.onRowClick] - Callback for handling row click events.
 * @param {React.CSSProperties} [props.containerStyle={}] - Custom styles for the table container.
 * @param {React.CSSProperties} [props.paperStyle={}] - Custom styles for the paper container.
 * @param {string[]} [props.visibleColumns] - A list of column keys to control column visibility.
 * @param {IDataTable.ExpandableTableConfig<T>} [props.getExpandableTableConfig] - Configuration for expandable rows.
 * @param {"small" | "medium"} [props.size="small"] - The size of the table rows.
 * @param {(key: string) => string} [props.getLocalizedText] - Function to retrieve localized text for column headers and labels.
 * @param {object} [props.rest] - Additional props to be passed to the underlying `<Table>` component.
 *
 * @returns {React.JSX.Element} The rendered DataTable component.
 */
const DataTable = <T extends IDataTable.GenericRecord>(
  props: IDataTable.Props<T>
): React.JSX.Element => {
  const {
    serialNumber,
    rows,
    columns: _columns,
    groups = [],
    pagination = false,
    paginationData,
    onChangePaginationData,
    additionalColumns,
    onRowClick,
    containerStyle = {},
    paperStyle = {},
    sx = {},
    visibleColumns,
    getExpandableTableConfig,
    size = "small",
    getLocalizedText,
    exportConfig = {},
    rowSelection = false,
    selectedRows,
    onChangeSelectedRows,
    ...rest
  } = props;

  const theme = useTheme();

  const handleExportCSV = () => {
    ExportManager.exportToCSV(
      {
        rows,
        columns,
        groups,
        filename: exportConfig.filename || "table-export",
        getLocalizedText,
        paginationData,
        serialNumber,
      },
      exportConfig.dateTimeStamp
    );
  };

  const handleExportPDF = () => {
    ExportManager.exportToPDF(
      {
        rows,
        columns,
        groups,
        filename: exportConfig.filename || "table-export",
        title: exportConfig.title || "Table Export",
        getLocalizedText,
        paginationData,
        serialNumber,
      },
      exportConfig.dateTimeStamp
    );
  };

  const handleChangeSelected = useCallback(
    (selectedRow: T) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      if (!selectedRows || !onChangeSelectedRows) return;

      const isSelected = selectedRows.some((row) => row.id === selectedRow.id);
      const newSelection = isSelected
        ? selectedRows.filter((row) => row.id !== selectedRow.id)
        : [...selectedRows, selectedRow];

      onChangeSelectedRows(newSelection);
    },
    [onChangeSelectedRows, selectedRows]
  );

  const showExportButtons = exportConfig.csvEnabled || exportConfig.pdfEnabled;

  const columns = useMemo(() => {
    const _columnsData: IDataTable.Column<T>[] = [];

    if (rowSelection) {
      _columnsData.push({
        _key: "selected",
        label: "",
        renderCell: (row) => {
          return (
            <Checkbox
              sx={{
                padding: 0,
                borderRadius: 0,
              }}
              checked={selectedRows?.some(
                (selectedRow) => selectedRow.id === row.id
              )}
              onKeyDown={(e) => e.stopPropagation()}
              onClick={handleChangeSelected(row)}
            />
          );
        },
      });
    }

    if (serialNumber) {
      _columnsData.push(SERIAL_NUMBER_COLUMN);
    }

    return [..._columnsData, ..._columns];
  }, [
    _columns,
    handleChangeSelected,
    rowSelection,
    selectedRows,
    serialNumber,
  ]);

  const { groupWidths, updateColumnWidth } = useGroupedColumns(
    _columns,
    visibleColumns
  );

  if (rowSelection && rows.length && !rows[0].id) {
    throw new Error(
      "Unique id is required in each row to enable row selection!"
    );
  }

  return (
    <>
      <Paper
        sx={{
          minHeight: 500,
          width: "100%",
          overflow: "hidden",
          boxShadow: "none",
          ...paperStyle,
        }}
      >
        {showExportButtons && (
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              minHeight: "20px !important",
              paddingBottom: 1,
              paddingTop: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" spacing={1}>
              {exportConfig.csvEnabled && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportCSV}
                  sx={{ minWidth: "auto" }}
                >
                  CSV
                </Button>
              )}
              {exportConfig.pdfEnabled && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleExportPDF}
                  sx={{ minWidth: "auto" }}
                >
                  PDF
                </Button>
              )}
            </Stack>
          </Toolbar>
        )}
        <TableContainer
          sx={{
            minHeight: "inherit",
            overflow: "auto",
            ...containerStyle,
          }}
        >
          <Table
            size={size}
            stickyHeader
            sx={{
              tableLayout: "fixed",
              width: "fit-content",
              ...sx,
            }}
            aria-label="collapsible table"
            {...rest}
          >
            {!!groups.length && (
              <RenderGroupHeaders {...props} groupWidths={groupWidths} />
            )}
            <RenderHeaders {...props} updateColumnWidth={updateColumnWidth} />
            <TableBody>
              {rows.map((item: T, index: number) => {
                return (
                  <RenderRow
                    key={index}
                    row={{
                      ...(serialNumber
                        ? {
                            "s.no.": getSerialNumber({ paginationData, index }),
                          }
                        : {}),
                      ...item,
                    }}
                    columns={columns}
                    visibleColumns={visibleColumns}
                    additionalColumns={additionalColumns}
                    onClick={onRowClick}
                    getExpandableTableConfig={getExpandableTableConfig}
                    getLocalizedText={getLocalizedText}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {pagination && paginationData && onChangePaginationData && (
        <CustomPagination
          paginationData={paginationData}
          onChangePaginationData={onChangePaginationData}
          getLocalizedText={getLocalizedText}
        />
      )}
    </>
  );
};

export default DataTable;
