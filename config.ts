/** Repository-wide configuration. */

import { Configuration } from "./scripts/types.ts";
import { generateBuildOptions } from "./scripts/utils.ts";

export const config: Configuration = {
    buildTargets: {
        "globaljs": {
            targetwiki: "metawiki",
            targetpage: "User:DinhHuy2010/global.js",
            name: "global.js",
            expectedOutputLocation: "./build/global.js",
            options: generateBuildOptions({
                entryPoints: ["./src/global.ts"],
            }),
        },
        "globalcss": {
            targetwiki: "metawiki",
            targetpage: "User:DinhHuy2010/global.css",
            name: "global.css",
            expectedOutputLocation: "./build/global.css",
            options: generateBuildOptions({
                entryPoints: ["./src/global.css"],
            }),
        },
    },
};
