import { TableCell, useTheme } from "@mui/material";
import { IDataTable } from "../types";

/**
 * A React functional component that renders additional column headers for a data table.
 *
 * @template T - A generic type extending `IDataTable.GenericRecord`.
 *
 * @param {Object} props - The props object.
 * @param {IDataTable.AdditionalColumn<T>[]} props.data - An array of additional column definitions.
 * Each column definition includes a label, visibility (hidden), and optional width.
 *
 * @returns {(React.JSX.Element | null)[]} An array of `TableCell` elements representing the additional
 * column headers. If a column is marked as hidden, it returns `null` for that column.
 *
 * @remarks
 * - The component uses the Material-UI `useTheme` hook to apply theme-based styles.
 * - Each visible column header is styled with a minimum width, bold font weight, and a bottom border.
 * - The `label` property of each column is used as the key for the `TableCell` element.
 */
const AdditonalColumnHeaders = <T extends IDataTable.GenericRecord>({
  data,
}: {
  data: IDataTable.AdditionalColumn<T>[];
}): (React.JSX.Element | null)[] => {
  const theme = useTheme();

  return data.map(({ label, hidden, width }) => {
    if (hidden) {
      return null;
    }

    return (
      <TableCell
        key={label}
        className="column"
        sx={{
          minWidth: width ?? 150,
          fontWeight: 600,
          borderBottom: `1px solid ${theme.palette.grey[300]}`,
        }}
      >
        {label}
      </TableCell>
    );
  });
};

export default AdditonalColumnHeaders;
