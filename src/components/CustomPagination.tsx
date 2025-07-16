import { TablePagination, Typography } from "@mui/material";
import { IDataTable } from "../types";

interface IProps {
  paginationData: IDataTable.Pagination;
  onChangePaginationData: (data: Partial<IDataTable.Pagination>) => void;
  getLocalizedText?: IDataTable.Props<any>["getLocalizedText"];
  hideRowsPerPage?: boolean;
}

/**
 * CustomPagination component provides pagination controls for a table.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.paginationData - The pagination data.
 * @param {number} props.paginationData.pageNo - The current page number.
 * @param {number} props.paginationData.pageSize - The number of records per page.
 * @param {number} props.paginationData.totalRecords - The total number of records.
 * @param {function} props.onChangePaginationData - Callback function to handle pagination data changes.
 *
 * @example
 * const paginationData = {
 *   pageNo: 1,
 *   pageSize: 10,
 *   totalRecords: 100
 * };
 * const handlePaginationChange = (newPaginationData) => {
 *   console.log(newPaginationData);
 * };
 *
 * <CustomPagination
 *   paginationData={paginationData}
 *   onChangePaginationData={handlePaginationChange}
 * />
 */
const CustomPagination = ({
  paginationData,
  onChangePaginationData,
  getLocalizedText,
  hideRowsPerPage = false,
}: IProps) => {
  const { pageNo, pageSize, totalRecords } = paginationData;

  const onPageChange = (_: any, value: any) => {
    onChangePaginationData({ pageNo: value + 1, pageSize });
  };

  const onRowsPerPageChange = (e: any) => {
    onChangePaginationData({ pageSize: +e.target.value, pageNo: 1 });
  };

  return (
    <Typography
      component={"tr"}
      sx={{
        pt: 3,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <TablePagination
        labelRowsPerPage={
          getLocalizedText ? getLocalizedText("rowsPerPage") : "Rows per page:"
        }
        rowsPerPage={pageSize}
        rowsPerPageOptions={hideRowsPerPage ? [] : [5, 10, 25, 50, 100]}
        count={totalRecords}
        page={pageNo - 1}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ border: 0, overflow: "hidden" }}
        slotProps={{
          toolbar: {
            sx: { p: 0 },
          },
        }}
      />
    </Typography>
  );
};

export default CustomPagination;
