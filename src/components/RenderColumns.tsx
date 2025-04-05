import { SxProps, TableCell, TableProps } from "@mui/material";
import { IDataTable } from "../types";

const RenderColumns = <T extends IDataTable.GenericRecord>({
  columns,
  item,
  visibleColumns,
  size = "small",
}: {
  columns: IDataTable.Column<T>[];
  item: T;
  visibleColumns?: IDataTable.Props<T>["visibleColumns"];
  size?: TableProps["size"];
  style?: SxProps;
}) => {
  return (
    <>
      {columns.map(({ renderCell, width, _key, hidden, sx, title }) => {
        if (hidden) return null;

        if (visibleColumns && !visibleColumns.includes(_key)) return null;

        const _title =
          title || (_key && renderCell ? renderCell(item) : item[_key]);

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
              maxWidth: width ?? 150,
              ...(sx || {}),
            }}
          >
            {renderCell ? renderCell(item) : item[_key]}
          </TableCell>
        );
      })}
    </>
  );
};

export default RenderColumns;
