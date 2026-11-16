import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function sha256Hex(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const repoDir: string = dirname(fileURLToPath(import.meta.url));
const sourcePath: string = join(repoDir, "entry.png");
const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const destPath: string = join(outputDir, "entry.png");

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, destPath);

const size: number = statSync(destPath).size;
if (size === 0) {
  throw new Error(`output is empty: ${destPath}`);
}

const sourceHash: string = sha256Hex(sourcePath);
const destHash: string = sha256Hex(destPath);
if (sourceHash !== destHash) {
  throw new Error(`output does not match source: ${destPath}`);
}

console.log(`wrote ${destPath} (${size} bytes, sha256 ${destHash})`);
