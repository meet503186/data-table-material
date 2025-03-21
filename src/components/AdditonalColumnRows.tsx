import { IconButton, Switch, TableCell } from "@mui/material";
import { IDataTable } from "../types";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * A functional component that renders additional column rows for a data table.
 * This component is generic and works with any type that extends `IDataTable.GenericRecord`.
 *
 * @template T - The type of the data record, extending `IDataTable.GenericRecord`.
 *
 * @param {Object} props - The props for the component.
 * @param {IDataTable.AdditionalColumn<T>[]} props.data - An array of additional column definitions.
 * @param {T} props.item - The current data item being rendered.
 *
 * @returns {(React.JSX.Element | null)[]} An array of JSX elements or `null` for hidden columns.
 *
 * @remarks
 * - Each column is rendered as a `TableCell` with optional content based on the column type.
 * - Supported column types include:
 *   - `"switch"`: Renders a small `Switch` component.
 *   - `"deleteButton"`: Renders a small `IconButton` with a delete icon.
 * - Hidden columns (`hidden: true`) are skipped and return `null`.
 *
 * @example
 * ```tsx
 * const additionalColumns = [
 *   { label: "Active", width: 100, _key: "isActive", type: "switch", onClick: handleSwitch },
 *   { label: "Remove", width: 50, _key: "delete", type: "deleteButton", onClick: handleDelete },
 * ];
 *
 * const item = { isActive: true, delete: false };
 *
 * <AdditionalColumnRows data={additionalColumns} item={item} />;
 * ```
 */
const AdditionalColumnRows = <T extends IDataTable.GenericRecord>({
  data,
  item,
}: {
  data: IDataTable.AdditionalColumn<T>[];
  item: T;
}): (React.JSX.Element | null)[] => {
  return data.map(({ label, width, _key, hidden, type, onClick }) => {
    if (hidden) {
      return null;
    }

    function renderCell() {
      switch (type) {
        case "switch":
          return (
            <Switch
              size="small"
              checked={!!item[_key]}
              onClick={(e) => {
                e.stopPropagation();
                onClick(item);
              }}
            />
          );

        case "deleteButton":
          return (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onClick(item);
              }}
            >
              <DeleteIcon color="error" fontSize="small" />
            </IconButton>
          );
      }
    }

    return (
      <TableCell
        key={label}
        className="column"
        title={_key ? item[_key]?.toString() : ""}
        sx={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: width ?? 150,
        }}
      >
        {renderCell()}
      </TableCell>
    );
  });
};

export default AdditionalColumnRows;
