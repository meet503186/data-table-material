import { SxProps } from "@mui/material";
import { ReactNode } from "react";

/**
 * Namespace containing types and interfaces for the IDataTable component.
 */
export namespace IDataTable {
  /**
   * Props interface for the IDataTable component.
   *
   * @template T - A generic type extending `GenericRecord`.
   */

  export interface Props<T extends GenericRecord> {
    /**
     * Whether to display a serial number column.
     * @default false
     */
    serialNumber?: boolean;

    /**
     * Array of row data.
     */
    rows: T[];

    /**
     * Array of column definitions.
     */
    columns: Column<T>[];

    /**
     * Whether to enable pagination for the table.
     * @default false
     */
    pagination?: boolean;

    /**
     * Pagination data for the table.
     */
    paginationData?: Pagination;

    /**
     * Callback function triggered when the pagination data changes.
     *
     * @param data - An object containing the updated pagination data.
     *               Only the properties that need to be updated should be included.
     */
    onChangePaginationData?: (data: Partial<Pagination>) => void;

    /**
     * Additional columns to be displayed in the table.
     */
    additionalColumns?: AdditionalColumn<T>[];

    /**
     * Callback function triggered when a row is clicked.
     *
     * @param row - The row data that was clicked.
     */
    onRowClick?: (row: T) => void;

    /**
     * Custom styles for the container.
     */
    containerStyle?: SxProps;

    /**
     * Custom styles for the paper element.
     */
    paperStyle?: SxProps;

    /**
     * Array of column keys that should be visible in the table.
     */
    visibleColumns?: string[];
  }

  /**
   * A generic record type representing an object with string keys and any values.
   */
  export type GenericRecord = Record<string, any>;

  /**
   * Interface representing a column in the table.
   *
   * @template T - A generic type extending `GenericRecord`.
   */
  export interface Column<T extends GenericRecord> {
    /**
     * The key of the column, which can be a property of the row data or a custom string.
     */
    _key: Extract<keyof T, string> | (string & { custom?: true });

    /**
     * The label to display for the column.
     */
    label: string;

    /**
     * Function to render the cell content.
     *
     * @param node - The row data for the cell.
     * @returns The rendered cell content.
     */
    renderCell?: (node: T) => ReactNode | string;

    /**
     * The width of the column, either in pixels or as a percentage.
     */
    width?: number | string;

    /**
     * Whether the column is hidden.
     * @default false
     */
    hidden?: boolean;

    /**
     * Custom styles for the column.
     */
    sx?: SxProps;
  }

  /**
   * Interface representing an additional column in the table.
   *
   * @template T - A generic type extending `GenericRecord`.
   */
  /**
   * Represents an additional column in a data table with customizable properties and actions.
   *
   * @template T - The type of the row data.
   */
  export interface AdditionalColumn<T extends GenericRecord> {
    /**
     * The key of the additional column, which can either be a property of the row data
     * or a custom string.
     *
     * @type {Extract<keyof T, string> | (string & { custom?: true })}
     */
    _key: Extract<keyof T, string> | (string & { custom?: true });

    /**
     * The label to display for the additional column.
     *
     * @type {string}
     */
    label: string;

    /**
     * Callback function triggered when an action is performed on the column.
     *
     * @param {T} row - The row data associated with the action.
     */
    onClick: (row: T) => void;

    /**
     * The type of the additional column, which determines its behavior.
     *
     * @type {"switch" | "deleteButton"}
     * @remarks
     * - `"switch"`: Represents a toggle switch.
     * - `"deleteButton"`: Represents a delete button.
     */
    type: "switch" | "deleteButton";

    /**
     * Indicates whether the additional column is hidden.
     *
     * @type {boolean}
     * @default false
     */
    hidden?: boolean;

    /**
     * The width of the additional column in pixels.
     *
     * @type {number | undefined}
     */
    width?: number;

    /**
     * A function to determine if the user has permission to interact with the column.
     *
     * @param {T} row - The row data to evaluate permissions for.
     * @returns {boolean} - Returns `true` if the user has permission, otherwise `false`.
     */
    hasPermission?: (row: T) => boolean;
  }

  /**
   * Interface representing pagination data for the table.
   */
  export interface Pagination {
    /**
     * The current page number.
     */
    pageNo: number;

    /**
     * The number of rows per page.
     */
    pageSize: number;

    /**
     * The total number of pages.
     */
    total: number;

    /**
     * The total number of records.
     */
    totalRecords: number;
  }
}
