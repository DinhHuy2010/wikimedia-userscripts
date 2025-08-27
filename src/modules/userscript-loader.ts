import { FilterType } from "../filters/index.ts";
import type {
    ScriptHandlerOrLocation,
    UserScriptRecord,
} from "../types.ts";
import { log, warn } from "../utils.ts";
import { getWikiInfoSync } from "../wikis.ts";

/**
 * @description Check if a user script should be loaded based on the wiki and wildcard.
 * @private
 * @param wildcard {WikiDBWildCardType} - The wildcard to check against.
 * @param wiki {string} - The wiki to check.
 * @returns {boolean} - Whether the script should be loaded.
 */
function shouldLoad(filter: FilterType): boolean {
    return filter.checkAgainstFilter();
}

/**
 * @description Print information about the script being loaded.
 * @private
 */
function printInfo(
    name: string,
    wiki: string,
    internal: boolean,
): void {
    const stype = internal ? "internal" : "external";
    log(`Loading ${stype} script ${name} on ${wiki}.`);
}

/**
 * @description Print a warning message if the script is not applicable to the current wiki.
 * @private
 */
function printWarning(
    name: string,
    wiki: string,
    internal: boolean,
): void {
    const stype = internal ? "internal" : "external";
    warn(
        `Skipping ${stype} script ${name} as it is not applicable to ${wiki}.`,
    );
}

function executeScript(script: ScriptHandlerOrLocation) {
    if (typeof script === "string") {
        importScript(script);
    } else if (typeof script === "function") {
        script();
    } else {
        // Assuming script is UserScriptSourceInformation
        const base_url = getWikiInfoSync(script.sourcewiki)?.url;
        if (!base_url) {
            warn(`No base URL found for ${script.sourcewiki}.`);
            return;
        }
        const url = new URL(base_url);
        const ctype = script.ctype || "text/javascript";
        url.pathname = mw.util.wikiScript("index");
        url.searchParams.set("title", script.title);
        url.searchParams.set("action", "raw");
        url.searchParams.set("ctype", ctype);
        const scriptUrl = url.toString();
        mw.loader.load(scriptUrl, ctype);
    }
}

/**
 * @description Load an external user script.
 * @public
 * @param wiki {string} - The wiki where the script should be loaded.
 * @param record {UserScriptRecord} - The user script record containing the script to load.
 * @returns {void}
 */
export function loadExternalUserScript(
    wiki: string,
    name: string,
    record: UserScriptRecord,
    internal: boolean = false,
): void {
    if (!shouldLoad(record.filter)) {
        printWarning(name, wiki, internal);
        return;
    }
    printInfo(name, wiki, internal);
    executeScript(record.script);
}
