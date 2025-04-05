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
 * A generic DataTable component for rendering tabular data with customizable columns, rows, and additional features.
 *
 * @template T - The type of the data rows, extending a record with string keys and any values.
 *
 * @param {IDataTable.Props<T>} props - The props for the DataTable component.
 * @param {boolean} props.serialNumber - Whether to display a serial number column.
 * @param {T[]} props.rows - The data rows to be displayed in the table.
 * @param {IDataTable.Column<T>[]} props.columns - The column definitions for the table.
 * @param {IDataTable.PaginationData} [props.paginationData] - Optional pagination data for calculating serial numbers.
 * @param {IDataTable.AdditionalColumn[]} [props.additionalColumns] - Optional additional columns to be rendered.
 * @param {(item: T) => void} [props.onRowClick] - Optional callback triggered when a row is clicked.
 * @param {React.CSSProperties} [props.containerStyle={}] - Optional custom styles for the table container.
 * @param {React.CSSProperties} [props.paperStyle={}] - Optional custom styles for the Paper component.
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
            sx={{ minWidth: 800 }}
            aria-label="collapsible table"
            {...rest}
          >
            <TableHead>
              <TableRow>
                {getExpandableTableConfig && (
                  <TableCell
                    sx={{
                      minWidth: 80,
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
                      fontWeight: 600,
                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    S. No.
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
                          className="column"
                          sx={{
                            minWidth: width ?? 150,
                            fontWeight: 600,
                            borderBottom: `1px solid ${theme.palette.grey[300]}`,
                          }}
                        >
                          {label}
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
                  <AdditonalColumnHeaders data={additionalColumns} />
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
