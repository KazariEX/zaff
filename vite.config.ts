import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    base: "./",
    build: {
        outDir: "dist",
        lib: {
            entry: "src/index.ts",
            formats: [
                "es",
                "cjs"
            ]
        },
        rollupOptions: {
            external: ["chevrotain"]
        }
    },
    plugins: [
        dts({
            outDir: "types"
        })
    ]
});