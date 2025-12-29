import { SxProps } from "@mui/material";

export const DEFAULT_COL_WIDTH = 150;

export const fixedCellStyle = {
  minWidth: 80,
  width: 80,
  // fontWeight: 600,
  // borderBottom: (theme: Theme) => `1px solid ${theme.palette.grey[300]}`,
};

export const SERIAL_NUMBER_COLUMN = {
  _key: "s.no.",
  label: "S. No.",
  sx: fixedCellStyle as SxProps,
};
