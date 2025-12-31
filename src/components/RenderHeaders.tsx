import { IDataTable } from "../types/index";
import Resizable from "./Resizable";
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useTheme,
} from "@mui/material";
import { DEFAULT_COL_WIDTH } from "../constants";
import AdditionalColumnHeaders from "./AdditionalColumnHeaders";
import { useCallback, useMemo } from "react";
import { getPinnedStyles, usePinnedColumns } from "../hooks/usePinnedColumns";

const RenderHeaders = <T extends IDataTable.GenericRecord>({
  getExpandableTableConfig,
  rows,
  columns,
  visibleColumns,
  additionalColumns,
  getLocalizedText,
  updateColumnWidth,
  sortConfig,
}: IDataTable.Props<T> & {
  updateColumnWidth: (field: string, newWidth: number) => void;
}) => {
  const theme = useTheme();

  const { orderBy, order, onSort } = (sortConfig ||
    {}) as IDataTable.SortConfig;

  const { leftPinnedPositions, rightPinnedPositions } =
    usePinnedColumns(columns);

  const visibleColumnsSet = useMemo(
    () => (visibleColumns ? new Set(visibleColumns) : null),
    [visibleColumns]
  );

  const handleSort = useCallback(
    (column: string) => {
      const isAsc = orderBy === column && order === "asc";
      const newOrder = isAsc ? "desc" : "asc";

      onSort?.(column, newOrder);
    },
    [orderBy, order, onSort]
  );

  return (
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

        {columns.map(
          ({
            _key,
            label,
            sx,
            width,
            hidden,
            pinned,
            resizable,
            sortable,
            renderHeader,
          }) => {
            // Skip hidden columns
            if (hidden) return null;

            // Skip columns not in visible list
            if (visibleColumnsSet && !visibleColumnsSet.has(_key)) return null;

            const isResizable = resizable !== false;

            const children = renderHeader
              ? renderHeader(rows[0])
              : getLocalizedText
              ? getLocalizedText(label)
              : label;

            // Calculate pinned styles
            const pinnedStyles = getPinnedStyles(
              pinned,
              _key,
              leftPinnedPositions,
              rightPinnedPositions,
              theme.palette.background.default
            );

            return (
              <Resizable
                key={_key}
                updateColumnWidth={updateColumnWidth}
                resizable={isResizable}
              >
                {({ ref }) => (
                  <TableCell
                    data-field={_key}
                    sx={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      minWidth: width ?? DEFAULT_COL_WIDTH,
                      maxWidth: width ?? DEFAULT_COL_WIDTH,
                      width: width ?? DEFAULT_COL_WIDTH,
                      fontWeight: 600,
                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                      ...sx,
                      ...pinnedStyles,
                    }}
                    sortDirection={orderBy === _key ? order : false}
                  >
                    {sortable ? (
                      <TableSortLabel
                        active={orderBy === _key}
                        direction={orderBy === _key ? order : "asc"}
                        onClick={() => handleSort(_key)}
                      >
                        {children}
                      </TableSortLabel>
                    ) : (
                      children
                    )}

                    {isResizable && (
                      <Typography
                        className="resizer"
                        component={"span"}
                        ref={ref}
                        color="primary"
                        sx={{
                          ":active": {
                            background: isResizable
                              ? theme.palette.primary.main
                              : "",
                          },
                          ":hover": {
                            background: isResizable
                              ? theme.palette.primary.main
                              : "",
                          },
                          cursor: isResizable ? "col-resize" : "default",
                        }}
                      ></Typography>
                    )}
                  </TableCell>
                )}
              </Resizable>
            );
          }
        )}

        {additionalColumns && (
          <AdditionalColumnHeaders
            getLocalizedText={getLocalizedText}
            data={additionalColumns}
          />
        )}
      </TableRow>
    </TableHead>
  );
};

export default RenderHeaders;
