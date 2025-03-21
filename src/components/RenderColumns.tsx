import { TableCell } from "@mui/material";
import { IDataTable } from "../types";

const RenderColumns = <T extends IDataTable.GenericRecord>({
  columns,
  item,
}: {
  columns: IDataTable.Column<T>[];
  item: T;
}) => {
  return (
    <>
      {columns.map(({ renderCell, width, _key, hidden, sx }) => {
        if (hidden) {
          return null;
        }

        return (
          <TableCell
            key={_key}
            className="column"
            title={String(
              (_key && renderCell ? renderCell(item) : item[_key]) ?? ""
            )}
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
