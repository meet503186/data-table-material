# 📊 Data Table Material

A highly customizable and reusable Material UI-based table component built with TypeScript and React. Supports features like dynamic columns, pagination, row actions, expandable rows, and more.

## 🚀 Features

- ✅ Customizable columns and rows
- 🔢 Optional serial number column
- 📄 Expandable row support
- ➕ Additional action columns (switch, delete)
- 📜 Pagination with external control
- 🎯 Row click handling
- 🎨 Theme-aware styling using MUI `sx` props
- ⚡ Visible/hidden column control
- 📏 Resizable headers

---

## 📦 Installation

```bash
npm install data-table-material
# or
yarn add data-table-material
```

---

## ✨ Usage

```tsx
import DataTable from "data-table-material";

const columns = [
  { _key: "name", label: "Name" },
  { _key: "email", label: "Email" },
];

const rows = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Doe", email: "jane@example.com" },
];

export default function App() {
  return <DataTable rows={rows} columns={columns} />;
}
```

---

## 🧩 Props

### `IDataTable.Props<T>`

| Prop                       | Type                                  | Description                                      | Default      |
| -------------------------- | ------------------------------------- | ------------------------------------------------ | ------------ |
| `rows`                     | `T[]`                                 | Array of row data                                | **Required** |
| `columns`                  | `Column<T>[]`                         | Array of column definitions                      | **Required** |
| `serialNumber`             | `boolean`                             | Show serial number column                        | `false`      |
| `pagination`               | `boolean`                             | Enable pagination                                | `false`      |
| `paginationData`           | `Pagination`                          | Current pagination state                         | -            |
| `onChangePaginationData`   | `(data: Partial<Pagination>) => void` | Triggered when pagination changes                | -            |
| `additionalColumns`        | `AdditionalColumn<T>[]`               | Additional action columns (e.g., delete, switch) | -            |
| `onRowClick`               | `(row: T) => void`                    | Row click handler                                | -            |
| `containerStyle`           | `SxProps`                             | Custom style for container                       | `{}`         |
| `paperStyle`               | `SxProps`                             | Custom style for paper                           | `{}`         |
| `visibleColumns`           | `string[]`                            | Filter which columns are visible                 | -            |
| `getExpandableTableConfig` | `(row: T) => ReactNode`               | Expandable row renderer                          | -            |
| `size`                     | `"small" \| "medium"`                 | MUI Table size                                   | `"small"`    |
| `...rest`                  | `TableProps`                          | All other native Table props                     | -            |

---

## 🏗️ Column Definition

```ts
interface Column<T> {
  _key: keyof T | string;
  label: string;
  renderCell?: (row: T) => ReactNode;
  width?: number | string;
  hidden?: boolean;
  sx?: SxProps;
  title?: string;
}
```

---

## ➕ Additional Columns

Use these for actions like toggles or delete buttons.

```ts
interface AdditionalColumn<T> {
  _key: keyof T | string;
  label: string;
  onClick: (row: T) => void;
  type: "switch" | "deleteButton";
  hidden?: boolean;
  width?: number;
  hasPermission?: (row: T) => boolean;
}
```

---

## 🔄 Pagination Structure

```ts
interface Pagination {
  pageNo: number;
  pageSize: number;
  total: number;
  totalRecords: number;
}
```

Use `paginationData` to pass current pagination info and `onChangePaginationData` to update it.

---

## 🧰 Utilities

- ✅ `Resizable`: For resizable columns
- 🧩 `RenderRow`: Custom row renderer
- 📌 `AdditionalColumnHeaders`: Handles header rendering for additional columns
- 📚 `CustomPagination`: External pagination component

---

## 🖼️ Screenshots

> _Coming soon!_ Feel free to contribute UI previews!

---

## 🧪 Example

```tsx
<DataTable
  rows={data}
  columns={columns}
  serialNumber
  pagination
  paginationData={paginationState}
  onChangePaginationData={setPaginationState}
  additionalColumns={[
    {
      _key: "delete",
      label: "Delete",
      type: "deleteButton",
      onClick: handleDelete,
    },
  ]}
  onRowClick={(row) => console.log("Clicked row", row)}
/>
```

---

## 📁 Folder Structure

```
data-table-material/
├── components/
│   ├── DataTable.tsx
│   ├── RenderRow.tsx
│   ├── Resizable.tsx
│   ├── CustomPagination.tsx
│   └── AdditionalColumnHeaders.tsx
├── types/
│   └── index.ts
├── style.css
└── README.md
```

---

## 🧱 Built With

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)

---

## 🧑‍💻 Contributing

Contributions are welcome! Please open issues or submit PRs to help improve the component.

---

## 📝 License

MIT License

---

## 💬 Feedback

Found a bug or want a feature? Feel free to [open an issue](https://github.com/meet503186/data-table-material/issues).

---
