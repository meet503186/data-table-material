import { IDataTable } from "../types";

export function getSerialNumber({
  paginationData,
  index,
}: {
  paginationData: IDataTable.Pagination | undefined;
  index: number;
}): number {
  if (paginationData) {
    return paginationData.pageSize * (paginationData.pageNo - 1) + (index + 1);
  }

  return index + 1;
}
