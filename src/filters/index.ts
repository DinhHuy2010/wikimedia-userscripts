/**
 * @fileoverview Module for creating and evaluating filters.
 * @public
 */

import { NAMESPACE, WIKIS } from "../constants.ts";
import {
    isInMainPage,
    isOnMobileView,
    isTalkNamespace,
    toContentNamespace,
    toTalkNamespace,
} from "../utils.ts";

export interface FilterType {
    checkAgainstFilter(): boolean;
}

interface WikiDBFilterType extends FilterType {
    dbwildcard: string | string[] | RegExp;
    getWikisThatMatch(): string[];
}

interface WikiSkinFilterType extends FilterType {
    skinwildcard: string | string[] | RegExp;
}

interface PageNamespaceFilter extends FilterType {
    getMatchedNamespaces(): number[];
}

/**
 * Check if the current wiki's environment is suitable.
 * @public
 * @returns {boolean} True if the environment is suitable, false otherwise.
 */
export function checkEnvironment(filter: FilterType): boolean {
    return filter.checkAgainstFilter();
}

/**
 * @description A filter that always returns true.
 * @returns {FilterType} A filter that always returns true.
 */
export function validOnAnything(): FilterType {
    return {
        checkAgainstFilter: () => true,
    };
}

/**
 * @description Either one of the provided filters must match.
 * @param {FilterType[]} filters - An array of filters to check against.
 * @returns {FilterType} A filter that matches if any of the provided filters match.
 */
export function filterOr(filters: FilterType[]): FilterType {
    if (filters.length === 1) {
        return filters[0];
    }
    return {
        checkAgainstFilter: () => {
            for (const filter of filters) {
                if (filter.checkAgainstFilter()) {
                    return true;
                }
            }
            return false;
        },
    };
}

/**
 * @description All of the provided filters must match.
 * @param {FilterType[]} filters - An array of filters to check against.
 * @return {FilterType} A filter that matches if all of the provided filters match.
 */
export function filterAnd(filters: FilterType[]): FilterType {
    if (filters.length === 1) {
        return filters[0];
    }
    return {
        checkAgainstFilter: () => {
            for (const filter of filters) {
                if (!filter.checkAgainstFilter()) {
                    return false;
                }
            }
            return true;
        },
    };
}

/**
 * @description A filter that negates another filter.
 * @param {FilterType} filter - The filter to negate.
 * @return {FilterType} A filter that negates the provided filter.
 */
export function filterNot(filter: FilterType): FilterType {
    return {
        checkAgainstFilter: () => !filter.checkAgainstFilter(),
    };
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
            const dbname = mw.config.get("wgDBname");
            if (typeof dbwildcard === "string") {
                return dbname === dbwildcard ? [dbname] : [];
            } else if (dbwildcard instanceof RegExp) {
                return dbwildcard.test(dbname) ? [dbname] : [];
            } else if (Array.isArray(dbwildcard)) {
                return dbwildcard.includes(dbname) ? [dbname] : [];
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
 * @description A filter that matches on a specific wiki groups.
 * @param {string} group - The wiki group to match against. Supported groups: "wikipedia", "wiktionary", "wikibooks", "wikinews", "wikiquote", "wikisource", "wikiversity", "wikivoyage", "wikimedia", "multilingual".
 * @returns {WikiDBFilterType} A filter that matches on the specified wiki group.
 */
export function validOnWikiGroup(group: string): WikiDBFilterType {
    const dbs = Object.entries(WIKIS).filter(
        ([_, info]) => info.group === group,
    ).map(([dbname, _]) => dbname);
    return validOnWiki(dbs);
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
export function vaildOnMainPage(): FilterType {
    return {
        checkAgainstFilter: () => isInMainPage(),
    };
}

/**
 * @description A filter that matches if the current page is running on mobile view.
 * @returns {FilterType} A filter that matches if the current page is running on mobile view.
 */
export function validOnMobileView(): FilterType {
    return {
        checkAgainstFilter: () => isOnMobileView(),
    };
}
