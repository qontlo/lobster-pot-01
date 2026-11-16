import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const dest = join(outDir, "entry.png");

function digest(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);

const bytes = statSync(dest).size;
if (bytes === 0) {
  throw new Error(`refusing empty output: ${dest}`);
}
if (bytes > 1048576) {
  throw new Error(`output over the 1 MiB cap: ${bytes} bytes`);
}
if (digest(source) !== digest(dest)) {
  throw new Error(`output bytes differ from source: ${dest}`);
}

console.log(`wrote ${dest} (${bytes} bytes, sha256 ${digest(dest)})`);
