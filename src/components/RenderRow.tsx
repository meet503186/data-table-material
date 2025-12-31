import { Box, Collapse, IconButton, TableCell, TableRow } from "@mui/material";

import RenderColumns from "./RenderColumns";
import { IDataTable } from "../types/index";
import AdditionalColumnRows from "./AdditionalColumnRows";
import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { handleA11yKeyDown } from "../utils/helper";

const RenderRow = <T extends IDataTable.GenericRecord>({
  row,
  columns,
  visibleColumns,
  additionalColumns,
  onClick,
  getExpandableTableConfig,
  size = "small",
  getLocalizedText,
  hover = true,
}: {
  row: T;
  columns: IDataTable.Column<T>[];
  visibleColumns?: IDataTable.Props<T>["visibleColumns"];
  additionalColumns?: IDataTable.AdditionalColumn<T>[];
  onClick?: (item: T) => void;
  getExpandableTableConfig: IDataTable.Props<T>["getExpandableTableConfig"];
  size?: IDataTable.Props<T>["size"];
  getLocalizedText?: IDataTable.Props<T>["getLocalizedText"];
  hover?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const toggleCollapse = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <TableRow
        hover={hover}
        sx={{
          "&:last-of-type td, &:last-of-type th": { border: 0 },
          cursor: onClick ? "pointer" : "default",
          ":focus-visible": { outline: "1px solid" },
          position: "relative",
          zIndex: 1,
        }}
        tabIndex={onClick ? 0 : -1}
        onClick={() => onClick?.(row)}
        onKeyDown={handleA11yKeyDown(() => onClick?.(row))}
      >
        {getExpandableTableConfig && (
          <RenderColumns
            size={size}
            columns={[
              {
                _key: "collapse" + row.id,
                label: "",
                title: open ? "collapse" : "expand",
                renderCell: () => {
                  return (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse();
                      }}
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  );
                },
              },
            ]}
            item={row}
          />
        )}

        <RenderColumns
          columns={columns}
          item={row}
          visibleColumns={visibleColumns}
          size={size}
          getLocalizedText={getLocalizedText}
        />

        {additionalColumns && (
          <AdditionalColumnRows
            data={additionalColumns}
            item={row}
            size={size}
          />
        )}
      </TableRow>

      <TableRow
        sx={{
          width: "100%",
        }}
      >
        <TableCell
          size={size}
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={13}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ my: 1, width: "100%", ml: 4 }}>
              {getExpandableTableConfig && getExpandableTableConfig(row)}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RenderRow;
