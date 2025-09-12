// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

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
    banner: { js: HEADER_JS, css: HEADER_CSS },
    legalComments: "none",
    target: ["es6"],
    metafile: true,
};

export function generateBuildOptions(
    { ...overrides }: Partial<BuildOptions>,
): BuildOptions {
    const merged: BuildOptions = {};
    Object.assign(merged, COMMON_BUILD_OPTIONS, overrides);
    return merged;
}
