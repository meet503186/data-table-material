import { useState, useEffect, useRef } from "react";
import { IDataTable } from "../types";
import { DEFAULT_COL_WIDTH } from "../constants";

interface UseGroupedColumnsReturn<T extends IDataTable.GenericRecord> {
  groupWidths: Record<string, number>;
  updateColumnWidth: (
    field: string,
    newWidth: number
  ) => IDataTable.Column<T>[];
}

export function useGroupedColumns<T extends IDataTable.GenericRecord>(
  initialColumns: IDataTable.Column<T>[],
  visibleColumns?: string[]
): UseGroupedColumnsReturn<T> {
  const [groupWidths, setGroupWidths] = useState<IDataTable.GenericRecord>({});
  const columnsRef = useRef<IDataTable.Column<T>[]>(initialColumns);

  useEffect(() => {
    setGroupWidths(calculateGroupsWidth(initialColumns, visibleColumns));
    columnsRef.current = initialColumns;
  }, [initialColumns, visibleColumns]);

  const updateColumnWidth = (
    field: string,
    newWidth: number
  ): IDataTable.Column<T>[] => {
    const prevColumns = columnsRef.current;
    const changedColumn = prevColumns.find((c) => c._key === field);

    if (!changedColumn) return prevColumns;

    const updatedColumns = prevColumns.map((col) =>
      col._key === field ? { ...col, width: newWidth } : col
    );

    setGroupWidths(calculateGroupsWidth(updatedColumns, visibleColumns));

    columnsRef.current = updatedColumns;
    return updatedColumns;
  };

  return { groupWidths, updateColumnWidth };
}

function calculateGroupsWidth<T extends IDataTable.GenericRecord>(
  columns: IDataTable.Column<T>[],
  visibleColumns?: string[]
) {
  const widths: IDataTable.GenericRecord = {};
  columns
    .filter((col) => {
      if (visibleColumns) {
        return col.hidden !== true && visibleColumns.includes(col._key);
      }
      return col.hidden !== true;
    })
    .forEach((col) => {
      widths[col.groupId ?? col._key] =
        (widths[col.groupId ?? col._key] || 0) +
        +(col.width ?? DEFAULT_COL_WIDTH);
    });

  return widths;
}
