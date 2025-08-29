// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import { FilterType } from "./types.ts";

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
 * @description A filter that always returns false.
 * @returns {FilterType} A filter that always returns false.
 */
export function validOnNothing(): FilterType {
    return {
        checkAgainstFilter: () => false,
    };
}

/**
 * @description A filter that use a custom function.
 * @param {() => boolean} func - The custom function to use for filtering.
 * @returns {FilterType} A filter that uses the provided function.
 */
export function filterCustom(func: () => boolean): FilterType {
    return {
        checkAgainstFilter: func,
    };
}

/**
 * @description Either one of the provided filters must match.
 * @param {FilterType[]} filters - An array of filters to check against.
 * @returns {FilterType} A filter that matches if any of the provided filters match.
 */
export function filterOr<FT extends FilterType>(filters: [FT]): FT;
export function filterOr(filters: FilterType[]): FilterType;
export function filterOr<FT extends FilterType>(
    filters: [FT] | FilterType[],
): FT | FilterType {
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
export function filterAnd<FT extends FilterType>(filters: [FT]): FT;
export function filterAnd(filters: FilterType[]): FilterType;
export function filterAnd<FT extends FilterType>(
    filters: [FT] | FilterType[],
): FT | FilterType {
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
