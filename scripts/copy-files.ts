import { copyFile } from "node:fs/promises";
import { basename, resolve as nodeResolve } from "node:path";
import { fileURLToPath } from "node:url";

const _filename = fileURLToPath(import.meta.url);
const resolve = (...paths: string[]) => nodeResolve(_filename, "..", ...paths);

const destinations = [
    ["../LICENSE", "../packages/core"],
    ["../LICENSE", "../packages/parser"],
    ["../LICENSE", "../packages/zaff"],
    ["../README.md", "../packages/zaff"]
];

for (const [src, dest] of destinations) {
    await copyFile(resolve(src), resolve(dest, basename(src)));
}