import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const destinations = [
    ["../LICENSE", "../packages/zaff/LICENSE"],
    ["../README.md", "../packages/zaff/README.md"]
];

const _filename = fileURLToPath(import.meta.url);
for (const [src, dest] of destinations) {
    await copyFile(resolve(_filename, "..", src), resolve(_filename, "..", dest));
}