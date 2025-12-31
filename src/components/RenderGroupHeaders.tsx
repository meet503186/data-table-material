import { TableCell, TableHead, TableRow, useTheme } from "@mui/material";
import { IDataTable } from "../types/index";
import { DEFAULT_COL_WIDTH, fixedCellStyle } from "../constants";
import { getPinnedStyles, usePinnedColumns } from "../hooks/usePinnedColumns";
import { useMemo } from "react";

const RenderGroupHeaders = <T extends IDataTable.GenericRecord>({
  rowSelection,
  serialNumber,
  columns,
  groups = [],
  groupWidths,
  getLocalizedText,
  visibleColumns,
}: IDataTable.Props<T> & { groupWidths: IDataTable.GenericRecord }) => {
  const theme = useTheme();

  const { leftPinnedPositions, rightPinnedPositions, hasPinnedCols } =
    usePinnedColumns(columns);

  const visibleColumnsSet = useMemo(
    () => (visibleColumns ? new Set(visibleColumns) : null),
    [visibleColumns]
  );

  return (
    <TableHead>
      <TableRow>
        {rowSelection && <TableCell sx={fixedCellStyle}></TableCell>}
        {serialNumber && <TableCell sx={fixedCellStyle}></TableCell>}

        {columns.map(({ _key, groupId, pinned }, colIndex) => {
          const group = groupId ? groups.find((g) => g.id === groupId) : null;

          const firstIndexOfGroup = columns.findIndex(
            (c) => c.groupId === groupId
          );

          if (colIndex !== firstIndexOfGroup && groupId) {
            return null;
          }

          // Skip columns not in visible list
          if (visibleColumnsSet && !visibleColumnsSet.has(_key)) return null;

          const colSpan = groupId
            ? columns.filter((c) => {
                if (visibleColumns) {
                  return (
                    c.groupId === groupId &&
                    c.hidden !== true &&
                    visibleColumns.includes(c._key)
                  );
                }
                return c.groupId === groupId && c.hidden !== true;
              }).length
            : 1;

          // Calculate pinned styles
          const pinnedStyles = getPinnedStyles(
            pinned,
            _key,
            leftPinnedPositions,
            rightPinnedPositions,
            theme.palette.background.default
          );

          return (
            <TableCell
              key={_key}
              id={groupId}
              colSpan={colSpan}
              sx={{
                ...(!!groupId && {
                  ...(!hasPinnedCols && {
                    borderColor: theme.palette.grey[300],
                    borderStyle: "solid",
                    borderWidth: "2px",
                    borderTopWidth: 0,
                  }),
                  textAlign: "center",
                }),
                ...{
                  width: groupWidths[groupId ?? _key] ?? DEFAULT_COL_WIDTH,
                  fontWeight: 600,
                  borderBottom: `1px solid ${theme.palette.grey[300]}`,
                  padding: 0,
                },
                ...pinnedStyles,
                boxShadow: "none",
              }}
            >
              {group
                ? getLocalizedText
                  ? getLocalizedText(group.label)
                  : group.label
                : ""}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default RenderGroupHeaders;
