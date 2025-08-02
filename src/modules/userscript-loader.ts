import type { UserScriptRecord, WikiDBWildCardType } from "../types.ts";
import { log, warn } from "./utils.ts";

/**
 * @description Check if a user script should be loaded based on the wiki and wildcard.
 * @private
 * @param wildcard {WikiDBWildCardType} - The wildcard to check against.
 * @param wiki {string} - The wiki to check.
 * @returns {boolean} - Whether the script should be loaded.
 */
function shouldLoad(wildcard: WikiDBWildCardType, wiki: string): boolean {
    if (wildcard === "*") {
        return true;
    } else if (Array.isArray(wildcard)) {
        return wildcard.includes(wiki);
    }
    return false;
}

/**
 * @description Print information about the script being loaded.
 * @private
 */
function printInfo(
    name: string,
    wiki: string,
    record: UserScriptRecord,
    internal: boolean,
): void {
    if (record.wiki === "*") {
        log(
            `[${wiki}]: Loading ${
                internal ? "internal" : "external"
            } script ${name} for all Wikimedia projects.`,
        );
    } else {
        log(
            `[${wiki}]: Loading ${
                internal ? "internal" : "external"
            } script ${name} for wiki(s): ${record.wiki.join(", ")}.`,
        );
    }
}

/**
 * @description Print a warning message if the script is not applicable to the current wiki.
 * @private
 */
function printWarning(
    name: string,
    wiki: string,
): void {
    warn(
        `Skipping script ${name} as it is not applicable to ${wiki}.`,
    );
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
    if (!shouldLoad(record.wiki, wiki)) {
        printWarning(name, wiki);
        return;
    }
    printInfo(name, wiki, record, internal);
    if (typeof record.script === "string") {
        importScript(record.script);
    } else if (typeof record.script === "function") {
        record.script();
    } else {
        console.warn(`Invalid script type for wiki ${wiki}:`, record.script);
    }
}
