// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import { getWikis } from "./data.ts";
import { WikiInfo } from "./types.ts";

export async function getWikiInfo(db: string): Promise<WikiInfo | null> {
    const wikis = await getWikis();
    return wikis[db] || null;
}

export { getWikis };
