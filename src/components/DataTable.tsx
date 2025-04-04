// ** MUI Imports
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { Paper, useTheme } from "@mui/material";
import Resizable from "./Resizable";
import { IDataTable } from "../types";
import AdditonalColumnHeaders from "./AdditonalColumnHeaders";
import AdditionalColumnRows from "./AdditonalColumnRows";
import CustomPagination from "./CustomPagination";
import "./style.css";
import RenderColumns from "./RenderColumns";

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
          sx={{ minHeight: 500, mt: 2, overflow: "auto", ...containerStyle }}
        >
          <Table stickyHeader sx={{ minWidth: 800 }} aria-label="sticky table">
            <TableHead>
              <TableRow>
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
                          <span className="resizer" ref={ref}></span>
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
              {rows.map((item: T, index: number) => (
                <TableRow
                  hover
                  key={index}
                  sx={{
                    "&:last-of-type td, &:last-of-type th": { border: 0 },
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                  onClick={() => {
                    onRowClick && onRowClick(item);
                  }}
                >
                  {serialNumber && (
                    <TableCell key={index} className="column">
                      {!!paginationData
                        ? paginationData.pageSize *
                            (paginationData.pageNo - 1) +
                          (index + 1)
                        : index + 1}
                    </TableCell>
                  )}
                  <RenderColumns
                    columns={columns}
                    item={item}
                    visibleColumns={visibleColumns}
                  />

                  {additionalColumns && (
                    <AdditionalColumnRows
                      data={additionalColumns}
                      item={item}
                    />
                  )}
                </TableRow>
              ))}
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
