import { SxProps, TableCell, TableProps } from "@mui/material";
import { IDataTable } from "../types";
import { DEFAULT_COL_WIDTH } from "../constants";

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
  return (
    <>
      {columns.map((col) => {
        const { _key, width, hidden, sx, title, renderCell } = col;
        if (hidden) return null;

        if (visibleColumns && !visibleColumns.includes(_key)) return null;

        const _title = title
          ? getLocalizedText
            ? getLocalizedText(title)
            : title
          : _key && renderCell
          ? renderCell(item, col)
          : item[_key];

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
              maxWidth: width ?? DEFAULT_COL_WIDTH,
              ...(sx || {}),
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
