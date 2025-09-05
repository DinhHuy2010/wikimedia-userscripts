// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import * as builder from "./build.ts";
import * as publisher from "./publish.ts";

async function main() {
    console.log("Building targets...");
    await builder.main();
    console.log("Publishing targets...");
    await publisher.main();
}

if (import.meta.main) {
    await main();
}
