import { build } from "@ncpa0cpl/nodepack";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";
import { getCssLoaderPlugin } from "./css-loader.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = (...fpath) => path.resolve(__dirname, "..", ...fpath);

const isDev = process.argv.includes("--dev");
const watch = process.argv.includes("--watch");

function onBundleBuildComplete() {
  fs.rename(p("dist/bundle/esm/index.mjs"), p("dist/bundle/index.js"));
  fs.rm(p("dist/bundle/esm"), {
    recursive: true,
  }).catch(() => {});
}

async function main() {
  /** @type {import("@ncpa0cpl/nodepack").BuildConfig} */
  const bldOptions = {
    tsConfig: p("tsconfig.json"),
    srcDir: p("src"),
    outDir: p("dist"),
    target: "ESNext",
    formats: ["esm"],
    esDecorators: true,
    bundle: false,
    watch: watch,
    declarations: true,
    extMapping: {
      ".scss": ".style.mjs",
    },
    esbuildOptions: {
      keepNames: true,
      sourcemap: isDev ? "inline" : false,
      plugins: [getCssLoaderPlugin()],
    },
  };

  /** @type {import("@ncpa0cpl/nodepack").BuildConfig} */
  const bundleOptions = {
    ...bldOptions,
    declarations: false,
    entrypoint: p("src/index.tsx"),
    bundle: true,
    outDir: p("dist/bundle"),
    external: ["react", "react-spring"],
    onBuildComplete: onBundleBuildComplete,
  };

  const buildBase = () => build(bldOptions);
  const buildBundle = () =>
    build(bundleOptions).then(() => onBundleBuildComplete());

  await Promise.all([buildBase(), buildBundle()]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
