import alias from "@rollup/plugin-alias";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "index.js",
            format: "esm"
        }
    ],
    plugins: [
        typescript({
            tsconfig: "./tsconfig.json"
        }),
        alias({
            resolve: [".js"],
        }),
        resolve()
    ]
};