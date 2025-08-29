import { FilterType } from "../filters/index.ts";
import type {
    ScriptHandlerOrLocation,
    UserScriptRecord,
} from "../types.ts";
import { log, warn } from "../utils.ts";
import { getWikiInfo } from "../wikis/index.ts";

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

async function executeScript(script: ScriptHandlerOrLocation) {
    if (typeof script === "string") {
        importScript(script);
    } else if (typeof script === "function") {
        await script();
    } else {
        // Assuming script is UserScriptSourceInformation
        const base_url = (await getWikiInfo(script.sourcewiki))?.url;
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
 * @param {string} wiki - The wiki where the script should be loaded.
 * @param {string} name - The name of the script.
 * @param {UserScriptRecord} record - The user script record containing the script to load.
 * @param {boolean} [internal=false] - Whether the script is internal or external.
 * @returns {Promise<boolean>} - A promise that resolves to true if the script was loaded successfully, false otherwise.
 */
export function loadExternalUserScript(
    wiki: string,
    name: string,
    record: UserScriptRecord,
    internal: boolean = false,
): Promise<boolean> {
    if (!shouldLoad(record.filter)) {
        printWarning(name, wiki, internal);
        return Promise.resolve(false);
    }
    printInfo(name, wiki, internal);
    executeScript(record.script);
    return Promise.resolve(true);
}
