// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

export interface FilterType {
    /**
     * @description Check if the current wiki's environment is suitable.
     * @returns {boolean} True if the environment is suitable, false otherwise.
     */
    checkAgainstFilter(): boolean;
}

export interface WikiDBFilterType extends FilterType {
    /**
     * @description A wildcard, array of wildcards, or regular expression to match against wiki database names.
     * @returns {string | string[] | RegExp} The database wildcard to match against.
     */
    dbwildcard: string | string[] | RegExp;
    /**
     * @description Get the list of wikis that match the database wildcard.
     * @returns {string[]} An array of matching wiki names.
     */
    getWikisThatMatch(): string[];
}

export interface WikiSkinFilterType extends FilterType {
    /**
     * @description A wildcard, array of wildcards, or regular expression to match against wiki skin names.
     * @returns {string | string[] | RegExp} The skin wildcard to match against.
     */
    skinwildcard: string | string[] | RegExp;
}

export interface PageNamespaceFilter extends FilterType {
    /**
     * @description Get the list of namespaces that match the filter.
     * @returns {number[]} An array of matching namespace numbers.
     */
    getMatchedNamespaces(): number[];
}