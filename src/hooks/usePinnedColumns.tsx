import { useMemo } from "react";
import { IDataTable } from "../types";
import { DEFAULT_COL_WIDTH } from "../constants";

/**
 * Hook to calculate pinned column positions
 * Returns positioning maps for left and right pinned columns
 */
export const usePinnedColumns = <T extends IDataTable.GenericRecord>(
  columns: IDataTable.Column<T>[]
) => {
  return useMemo(() => {
    const leftCols = columns.filter((col) => col.pinned === "left");
    const rightCols = columns.filter((col) => col.pinned === "right");

    const hasPinnedCols = !!leftCols.length || !!rightCols.length;

    // Calculate cumulative positions for left-pinned columns
    const leftPinnedPositions = new Map<string, number>();
    let leftOffset = 0;
    leftCols.forEach((col) => {
      leftPinnedPositions.set(col._key, leftOffset);
      leftOffset += +(col.width || DEFAULT_COL_WIDTH);
    });

    // Calculate cumulative positions for right-pinned columns (from right to left)
    const rightPinnedPositions = new Map<string, number>();
    let rightOffset = 0;
    // Reverse to calculate from rightmost column
    [...rightCols].reverse().forEach((col) => {
      rightPinnedPositions.set(col._key, rightOffset);
      rightOffset += +(col.width || DEFAULT_COL_WIDTH);
    });

    return {
      leftPinnedPositions,
      rightPinnedPositions,
      hasPinnedCols,
    };
  }, [columns]);
};

/**
 * Helper function to get pinned styles for a column
 */
export const getPinnedStyles = (
  pinned: "left" | "right" | undefined,
  columnKey: string,
  leftPositions: Map<string, number>,
  rightPositions: Map<string, number>,
  backgroundColor: string
) => {
  if (!pinned) {
    return {
      position: "relative" as const,
    };
  }

  return {
    zIndex: 1,
    position: "sticky" as const,
    background: backgroundColor,
    boxShadow:
      pinned === "left"
        ? "2px 0 4px -2px rgba(0, 0, 0, 0.1)"
        : "-2px 0 4px -2px rgba(0, 0, 0, 0.1)",
    ...(pinned === "left"
      ? { left: leftPositions.get(columnKey) ?? 0 }
      : { right: rightPositions.get(columnKey) ?? 0 }),
  };
};
