/** Repository-wide configuration. */

import { BuildOptions, version } from "esbuild";

const buildDate = new Date().toISOString();

const HEADER_JS = `/**
 * User:DinhHuy2010/global.js
 * This script is loaded on all Wikimedia projects.
 * @copyright 2025-present DinhHuy2010
 * @license "CC-BY-4.0 OR MIT"
 * @repository https://github.com/DinhHuy2010/wikimedia-userscripts
 * @builtOn ${new Date().toISOString()}
 * @esbuildVersion ${version || "unknown"}
 */`;

const HEADER_CSS = `/**
 * User:DinhHuy2010/global.css
 * This stylesheet is loaded on all Wikimedia projects.
 * @copyright 2025-present DinhHuy2010
 * @license "CC-BY-4.0 OR MIT"
 * @repository https://github.com/DinhHuy2010/wikimedia-userscripts
 * @builtOn ${buildDate}
 * @esbuildVersion ${version || "unknown"}
 */`;

const COMMON_BUILD_OPTIONS: Partial<BuildOptions> = {
    bundle: true,
    platform: "browser",
    outdir: "./build",
    banner: { js: HEADER_JS, css: HEADER_CSS },
    legalComments: "none",
    target: ["es6"],
    metafile: true,
};

interface BuildTarget {
    targetwiki: string;
    targetpage: string;
    name: string;
    expectedOutputLocation: string;
    options: BuildOptions;
}

interface Configuration {
    buildTargets: BuildTarget[];
}

function generateBuildOptions(
    { ...overrides }: Partial<BuildOptions>,
): BuildOptions {
    const merged: BuildOptions = {};
    Object.assign(merged, COMMON_BUILD_OPTIONS, overrides);
    return merged;
}

export const config: Configuration = {
    buildTargets: [
        {
            targetwiki: "metawiki",
            targetpage: "User:DinhHuy2010/global.js",
            name: "global.js",
            expectedOutputLocation: "./build/global.js",
            options: generateBuildOptions({
                entryPoints: ["./src/global.ts"],
            }),
        },
        {
            targetwiki: "metawiki",
            targetpage: "User:DinhHuy2010/global.css",
            name: "global.css",
            expectedOutputLocation: "./build/global.css",
            options: generateBuildOptions({
                entryPoints: ["./src/global.css"],
            }),
        },
    ],
};
