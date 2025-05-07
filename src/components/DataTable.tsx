// ** MUI Imports
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { Paper, Typography, useTheme } from "@mui/material";
import Resizable from "./Resizable";
import { IDataTable } from "../types";
import AdditonalColumnHeaders from "./AdditonalColumnHeaders";
import CustomPagination from "./CustomPagination";
import "./style.css";
import RenderRow from "./RenderRow";

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
const DataTable = <T extends Record<string, any>>({
  serialNumber,
  rows,
  columns,
  pagination = false,
  paginationData,
  onChangePaginationData,
  additionalColumns,
  onRowClick,
  containerStyle = {},
  paperStyle = {},
  visibleColumns,
  getExpandableTableConfig,
  size = "small",
  getLocalizedText,
  ...rest
}: IDataTable.Props<T>): React.JSX.Element => {
  const theme = useTheme();

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
            sx={{ tableLayout: "fixed", width: "fit-content" }}
            aria-label="collapsible table"
            {...rest}
          >
            <TableHead>
              <TableRow>
                {getExpandableTableConfig && (
                  <TableCell
                    sx={{
                      minWidth: 80,
                      width: 80,
                      fontWeight: 600,
                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                    }}
                  ></TableCell>
                )}

                {serialNumber && (
                  <TableCell
                    key={"s.no."}
                    sx={{
                      minWidth: 80,
                      width: 80,
                      fontWeight: 600,
                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    {getLocalizedText
                      ? getLocalizedText("serialNumber")
                      : "S. No."}
                  </TableCell>
                )}

                {columns.map(({ _key, label, width, hidden }) => {
                  if (hidden) return null;

                  if (visibleColumns && !visibleColumns.includes(_key))
                    return null;

                  return (
                    <Resizable>
                      {({ ref }) => (
                        <TableCell
                          key={_key}
                          sx={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            width: width ?? 150,
                            fontWeight: 600,
                            borderBottom: `1px solid ${theme.palette.grey[300]}`,
                          }}
                        >
                          {getLocalizedText ? getLocalizedText(label) : label}
                          <Typography
                            className="resizer"
                            component={"span"}
                            ref={ref}
                            color="primary"
                            sx={{
                              ":active": {
                                background: theme.palette.primary.main,
                              },
                              ":hover": {
                                background: theme.palette.primary.main,
                              },
                            }}
                          ></Typography>
                        </TableCell>
                      )}
                    </Resizable>
                  );
                })}

                {additionalColumns && (
                  <AdditonalColumnHeaders
                    getLocalizedText={getLocalizedText}
                    data={additionalColumns}
                  />
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((item: T, index: number) => {
                return (
                  <RenderRow
                    key={index}
                    row={{
                      ...(serialNumber
                        ? {
                            "s.no.": !!paginationData
                              ? paginationData.pageSize *
                                  (paginationData.pageNo - 1) +
                                (index + 1)
                              : index + 1,
                          }
                        : {}),
                      ...item,
                    }}
                    columns={
                      serialNumber
                        ? [{ _key: "s.no.", label: "S. No." }, ...columns]
                        : columns
                    }
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
        />
      )}
    </>
  );
};

export default DataTable;
