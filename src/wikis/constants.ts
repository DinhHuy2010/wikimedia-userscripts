// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import { GIT_BRANCH, REPOSITORY } from "../constants.ts";

export const DATA_URL = new URL(
    `https://raw.githubusercontent.com/${REPOSITORY}/${GIT_BRANCH}/data/wikis.json`,
);
export const CACHE_KEY = "mw-dhscript-allwikisinfo";
