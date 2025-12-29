import { SxProps, TableCell, TableProps, useTheme } from "@mui/material";
import { IDataTable } from "../types";
import { DEFAULT_COL_WIDTH } from "../constants";
import { useMemo } from "react";
import { getPinnedStyles, usePinnedColumns } from "../hooks/usePinnedColumns";

const RenderColumns = <T extends IDataTable.GenericRecord>({
  columns,
  item,
  visibleColumns,
  size = "small",
  getLocalizedText,
}: {
  columns: IDataTable.Column<T>[];
  item: T;
  visibleColumns?: IDataTable.Props<T>["visibleColumns"];
  size?: TableProps["size"];
  style?: SxProps;
  getLocalizedText?: IDataTable.Props<T>["getLocalizedText"];
}) => {
  const theme = useTheme();

  // Memoize pinned columns with proper positioning calculations
  const { leftPinnedPositions, rightPinnedPositions } =
    usePinnedColumns(columns);

  // Filter visible columns
  const visibleColumnsSet = useMemo(
    () => (visibleColumns ? new Set(visibleColumns) : null),
    [visibleColumns]
  );

  return (
    <>
      {columns.map((col) => {
        const { _key, width, hidden, sx, title, pinned, renderCell } = col;

        // Skip hidden columns
        if (hidden) return null;

        // Skip columns not in visible list
        if (visibleColumnsSet && !visibleColumnsSet.has(_key)) return null;

        // Get display title
        const _title = title
          ? getLocalizedText
            ? getLocalizedText(title)
            : title
          : _key && renderCell
          ? renderCell(item, col)
          : item[_key];

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
            size={size}
            className="column"
            title={typeof _title === "string" ? _title : ""}
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              minWidth: width ?? DEFAULT_COL_WIDTH,
              maxWidth: width ?? DEFAULT_COL_WIDTH,
              width: width ?? DEFAULT_COL_WIDTH,
              ...(sx || {}),
              ...pinnedStyles,
            }}
          >
            {renderCell ? renderCell(item, col) : item[_key]}
          </TableCell>
        );
      })}
    </>
  );
};

export default RenderColumns;
