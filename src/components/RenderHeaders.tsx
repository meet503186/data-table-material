import { IDataTable } from "../types";
import Resizable from "./Resizable";
import {
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { DEFAULT_COL_WIDTH, fixedCellStyle } from "../constants";
import AdditonalColumnHeaders from "./AdditonalColumnHeaders";

const RenderHeaders = <T extends IDataTable.GenericRecord>({
  getExpandableTableConfig,
  rowSelection,
  serialNumber,
  rows,
  columns,
  visibleColumns,
  additionalColumns,
  getLocalizedText,
  updateColumnWidth,
}: IDataTable.Props<T> & {
  updateColumnWidth: (field: string, newWidth: number) => void;
}) => {
  const theme = useTheme();
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

        {rowSelection && (
          <TableCell key={"selected"} sx={fixedCellStyle}></TableCell>
        )}
        {serialNumber && (
          <TableCell key={"s.no."} sx={fixedCellStyle}>
            {getLocalizedText ? getLocalizedText("serialNumber") : "S. No."}
          </TableCell>
        )}

        {columns.map(({ _key, label, width, hidden, renderHeader }) => {
          if (hidden) return null;

          if (visibleColumns && !visibleColumns.includes(_key)) return null;

          return (
            <Resizable updateColumnWidth={updateColumnWidth}>
              {({ ref }) => (
                <TableCell
                  key={_key}
                  data-field={_key}
                  sx={{
                    position: "relative",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    width: width ?? DEFAULT_COL_WIDTH,
                    fontWeight: 600,
                    borderBottom: `1px solid ${theme.palette.grey[300]}`,
                  }}
                >
                  {renderHeader
                    ? renderHeader(rows[0])
                    : getLocalizedText
                    ? getLocalizedText(label)
                    : label}
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
          <AdditonalColumnHeaders
            getLocalizedText={getLocalizedText}
            data={additionalColumns}
          />
        )}
      </TableRow>
    </TableHead>
  );
};

export default RenderHeaders;
