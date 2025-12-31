import { IDataTable } from "../types/index";

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

export const handleA11yKeyDown =
  (callback: (args?: unknown) => void) => (event: React.KeyboardEvent) => {
    if (!callback) return;

    if (event.code === "Space" || event.code === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      callback(event);
    }
  };
