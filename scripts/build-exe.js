const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const cachePath = path.join(projectRoot, ".pkg-cache");
const outputPath = path.join(projectRoot, "dist", "inv_cuarta.exe");

fs.mkdirSync(cachePath, { recursive: true });
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const pkgCli = require.resolve("pkg/lib-es5/bin.js");
const args = [
  pkgCli,
  "server.js",
  "--targets",
  "node18-win-x64",
  "--output",
  outputPath
];

const env = {
  ...process.env,
  PKG_CACHE_PATH: cachePath,
  PKG_IGNORE_HASH: "1"
};

console.log("Compilando ejecutable con cache local:", cachePath);
const result = spawnSync(process.execPath, args, {
  cwd: projectRoot,
  env,
  stdio: "inherit"
});

if (result.error) {
  console.error("Error al ejecutar pkg:", result.error.message);
  process.exit(1);
}

if (typeof result.status === "number" && result.status !== 0) {
  process.exit(result.status);
}

console.log("Ejecutable generado en:", outputPath);
