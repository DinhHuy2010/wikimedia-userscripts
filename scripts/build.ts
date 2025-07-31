import { build } from "esbuild";

build({
    bundle: true,
    platform: "browser",
    entryPoints: ["wikimedia-userscript-global.ts"],
    outfile: "wikimedia-userscript-global.esbuilt.js",
    banner: {
        js: `// User:DinhHuy2010/global.js
// This script is loaded on all Wikimedia projects.
// Copyright (c) 2025-present DinhHuy2010
// License: CC-BY-4.0`
    }
});
