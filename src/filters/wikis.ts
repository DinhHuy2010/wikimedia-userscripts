// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

/**
 * @fileoverview Module for creating and evaluating filters.
 * @public
 */

import { NAMESPACE } from "../constants.ts";
import {
    isInMainPage,
    isOnMobileView,
    isTalkNamespace,
    toContentNamespace,
    toTalkNamespace,
} from "../utils.ts";
import { getWikis } from "../wikis/index.ts";
import {
    FilterType,
    PageNamespaceFilter,
    WikiDBFilterType,
    WikiSkinFilterType,
} from "./types.ts";

function getDatabasesSync(): string[] {
    const s: string[] = [];
    getWikis().then(
        (w) => {
            s.push(...Object.keys(w));
        },
    );
    return s;
}

/**
 * @description A filter that matches on the wiki running via $wgDBname.
 * @param {string | string[] | RegExp} dbwildcard - The database name(s) or pattern to match against.
 * @returns {WikiDBFilterType} A filter that matches on the specified wiki(s).
 */
export function validOnWiki(
    dbwildcard: string | string[] | RegExp,
): WikiDBFilterType {
    return {
        dbwildcard,
        getWikisThatMatch: () => {
            const dbs = getDatabasesSync();
            if (typeof dbwildcard === "string") {
                return dbs.filter((db) => db === dbwildcard);
            } else if (dbwildcard instanceof RegExp) {
                return dbs.filter((db) => dbwildcard.test(db));
            } else if (Array.isArray(dbwildcard)) {
                return dbs.filter((db) => dbwildcard.includes(db));
            }
            return [];
        },
        checkAgainstFilter: () => {
            if (typeof dbwildcard === "string") {
                return mw.config.get("wgDBname") === dbwildcard;
            } else if (dbwildcard instanceof RegExp) {
                return dbwildcard.test(mw.config.get("wgDBname"));
            } else if (Array.isArray(dbwildcard)) {
                return dbwildcard.includes(mw.config.get("wgDBname"));
            }
            return false;
        },
    };
}

/**
 * @description A filter that matches on multlingual wikis.
 * @returns {WikiDBFilterType} A filter that matches on multilingual wikis.
 */
export function validOnMultilingualWikis(): WikiDBFilterType {
    return validOnWiki([
        "mediawikiwiki",
        "metawiki",
        "commonswiki",
        "specieswiki",
        "wikidatawiki",
    ]);
}

/**
 * @description A filter that matches on the wiki page' namespace.
 * @param {number | number[]} ns - The namespace number(s) to match against.
 * @param {boolean} [includeAssociated=false] - Whether to include associated talk/content namespaces.
 * @returns {PageNamespaceFilter} A filter that matches on the specified namespace(s).
 */
export function validOnNamespace(
    { namespace, includeAssociated = false }: {
        namespace: number | number[];
        includeAssociated?: boolean;
    },
): PageNamespaceFilter {
    return {
        checkAgainstFilter: () => {
            const currentNamespaces: number[] = [];
            currentNamespaces.push(NAMESPACE);
            if (includeAssociated) {
                if (isTalkNamespace(NAMESPACE)) {
                    currentNamespaces.push(toContentNamespace(NAMESPACE));
                } else {
                    currentNamespaces.push(toTalkNamespace(NAMESPACE));
                }
            }
            if (typeof namespace === "number") {
                return currentNamespaces.includes(namespace);
            } else if (Array.isArray(namespace)) {
                return namespace.some((ns) => currentNamespaces.includes(ns));
            } else {
                return false;
            }
        },
        getMatchedNamespaces: () => {
            const matchedNamespaces: number[] = [];
            if (typeof namespace === "number") {
                matchedNamespaces.push(namespace);
            } else if (Array.isArray(namespace)) {
                matchedNamespaces.push(...namespace);
            }
            if (includeAssociated) {
                const associatedNamespaces: number[] = [];
                for (const ns of matchedNamespaces) {
                    if (isTalkNamespace(ns)) {
                        associatedNamespaces.push(toContentNamespace(ns));
                    } else {
                        associatedNamespaces.push(toTalkNamespace(ns));
                    }
                }
                matchedNamespaces.push(...associatedNamespaces);
            }
            return matchedNamespaces;
        },
    };
}

/**
 * @description A filter that matches on the current skin that wiki environment is using.
 * @param {string | string[] | RegExp} skinwildcard - The skin name(s) or pattern to match against.
 * @returns {FilterType} A filter that matches on the specified skin(s).
 */
export function validOnSkin(
    skinwildcard: string | string[] | RegExp,
): WikiSkinFilterType {
    return {
        skinwildcard,
        checkAgainstFilter: () => {
            const skin = mw.config.get("skin");
            if (typeof skinwildcard === "string") {
                return skin === skinwildcard;
            } else if (skinwildcard instanceof RegExp) {
                return skinwildcard.test(skin);
            } else if (Array.isArray(skinwildcard)) {
                return skinwildcard.includes(skin);
            }
            return false;
        },
    };
}

/**
 * @description A filter that matches if the current page is the main page.
 * @returns {FilterType} A filter that matches if the current page is the main page.
 */
export function validOnMainPage(): FilterType {
    return {
        checkAgainstFilter: isInMainPage,
    };
}

/**
 * @description A filter that matches if the current page is running on mobile view.
 * @returns {FilterType} A filter that matches if the current page is running on mobile view.
 */
export function validOnMobileView(): FilterType {
    return {
        checkAgainstFilter: isOnMobileView,
    };
}
