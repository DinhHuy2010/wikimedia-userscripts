// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import { BuildOptions } from "esbuild";

export interface BuildTarget {
    targetwiki: string;
    targetpage: string;
    name: string;
    expectedOutputLocation: string;
    options: BuildOptions;
}

export interface Configuration {
    buildTargets: Record<string, BuildTarget>;
}
