import * as esbuild from "esbuild";

const HEADER_JS = `/**
 * User:DinhHuy2010/global.js
 * This script is loaded on all Wikimedia projects.
 * @copyright 2025-present DinhHuy2010
 * @license "CC-BY-4.0 OR MIT"
 * @repository https://github.com/DinhHuy2010/wikimedia-userscripts
 * @builtOn ${new Date().toISOString()}
 * @esbuildVersion ${esbuild.version || "unknown"}
 */`;

const HEADER_CSS = `/**
 * User:DinhHuy2010/global.css
 * This stylesheet is loaded on all Wikimedia projects.
 * @copyright 2025-present DinhHuy2010
 * @license "CC-BY-4.0 OR MIT"
 * @repository https://github.com/DinhHuy2010/wikimedia-userscripts
 * @builtOn ${new Date().toISOString()}
 * @esbuildVersion ${esbuild.version || "unknown"}
 */`;

function main(): void {
    esbuild.buildSync({
        bundle: true,
        platform: "browser",
        entryPoints: ["./src/global.ts", "./src/global.css"],
        outdir: "./build",
        banner: { js: HEADER_JS, css: HEADER_CSS },
        legalComments: "none",
        target: ["es2017"],
    });
}
if (import.meta.main) {
    main();
}
