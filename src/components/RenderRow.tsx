import { Box, Collapse, IconButton, TableCell, TableRow } from "@mui/material";

import RenderColumns from "./RenderColumns";
import { IDataTable } from "../types";
import AdditionalColumnRows from "./AdditonalColumnRows";
import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const RenderRow = <T extends IDataTable.GenericRecord>({
  row,
  columns,
  visibleColumns,
  additionalColumns,
  onClick,
  getExpandableTableConfig,
  size = "small",
}: {
  row: T;
  columns: IDataTable.Column<T>[];
  visibleColumns?: IDataTable.Props<T>["visibleColumns"];
  additionalColumns?: IDataTable.AdditionalColumn<T>[];
  onClick?: (item: T) => void;
  getExpandableTableConfig: IDataTable.Props<T>["getExpandableTableConfig"];
  size?: IDataTable.Props<T>["size"];
}) => {
  const [open, setOpen] = useState(false);

  const toggleCollapse = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          "&:last-of-type td, &:last-of-type th": { border: 0 },
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={() => {
          onClick && onClick(row);
        }}
      >
        {getExpandableTableConfig && (
          <RenderColumns
            size={size}
            columns={[
              {
                _key: "collapse",
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
