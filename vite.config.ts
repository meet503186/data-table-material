import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      include: ["src"],
      outDir: "dist/types",
      tsconfigPath: "./tsconfig.node.json",
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MuiDataTable",
      fileName: "data-table-material",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@mui/material",
        "@mui/icons-material",
        "@emotion/react",
        "@emotion/styled",
        "jspdf",
        "jspdf-autotable",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@mui/material": "MaterialUI",
          "@mui/icons-material": "MaterialUIIcons",
          "@emotion/react": "EmotionReact",
          "@emotion/styled": "EmotionStyled",
        },
        assetFileNames: (assetInfo) => {
          return assetInfo.names
            .map((name) => {
              if (name.endsWith(".css")) {
                return "style.css";
              }

              return name;
            })
            .join(", ");
        },
      },
    },
  },
});
