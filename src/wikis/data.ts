// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import { WikiEntryModel, Wikis } from "./types.ts";
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

class WikiEntry {
    constructor(public wiki: WikiEntryModel) {
        this.wiki = wiki;
    }

    get db(): string {
        return this.wiki.db;
    }
    get url(): string {
        return this.wiki.url;
    }
    get partOf(): string | null {
        return this.wiki.edition;
    }
    get name(): string {
        return this.wiki.label;
    }

    isMultilingual(): boolean {
        return this.wiki.edition !== null;
    }

    getAPI(): mw.ForeignApi {
        return new mw.ForeignApi(`${this.url}w/api.php`);
    }
}

export class WikiEntries {
    constructor(public wikis: Wikis) {
        this.wikis = wikis;
    }

    get(db: string): WikiEntry | null {
        const wiki = this.wikis[db];
        if (wiki) {
            return new WikiEntry(wiki);
        }
        return null;
    }

    match(pattern: string | string[] | RegExp): WikiEntry[] {
        return Object.keys(this.wikis).filter(
            (db) => {
                if (typeof pattern === "string") {
                    return db === pattern;
                } else if (pattern instanceof RegExp) {
                    return pattern.test(db);
                } else if (Array.isArray(pattern)) {
                    return pattern.includes(db);
                }
                return false;
            },
        ).map((db) => new WikiEntry(this.wikis[db]));
    }

    getMultilingualWikis(): WikiEntry[] {
        return Object.keys(this.wikis).filter(
            (db) => this.wikis[db].edition !== null,
        ).map((db) => new WikiEntry(this.wikis[db]));
    }
}

export async function getWikis(): Promise<WikiEntries> {
    const cached = getCacheIfPossible();
    if (cached) {
        return new WikiEntries(cached);
    }

    const response = await fetch(DATA_URL);
    const wikis = await response.json() as Wikis;
    setCache(JSON.stringify(wikis));
    return new WikiEntries(wikis);
}
