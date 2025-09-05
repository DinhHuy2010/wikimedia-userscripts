// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import { Wikis } from "./types.ts";
import { warn } from "../utils.ts";
import { CACHE_KEY, DATA_URL } from "./constants.ts";

function getCacheIfPossible(): Wikis | null {
    const cached = mw.storage.get(CACHE_KEY);
    if (typeof cached === "string") {
        return JSON.parse(cached) as Wikis;
    }
    if (cached === false) {
        warn(mw.msg("mw-dhscript-wikis-nostorage-warning"));
    }
    return null;
}

function setCache(blob: string): void {
    mw.storage.set(CACHE_KEY, blob, 86400);
}

export async function getWikis(): Promise<Wikis> {
    const cached = getCacheIfPossible();
    if (cached) {
        return cached;
    }

    const response = await fetch(DATA_URL);
    const wikis = await response.json() as Wikis;
    setCache(JSON.stringify(wikis));
    return wikis;
}
