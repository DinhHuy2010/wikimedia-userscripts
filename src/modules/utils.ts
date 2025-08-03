import { ApiParseParams } from "../types.ts";
import { SCRIPT_NAME } from "../constants.ts";
import { dhoptions } from "../options.ts";

function isTalkNamespace(n: number): boolean {
    return n >= 0 && n % 2 === 1;
}

export function toContentNamespace(n: number): number {
    if (isTalkNamespace(n)) {
        return n - 1; // Convert talk namespace to content namespace
    }
    return n; // Return the same namespace if it's not a talk namespace
}

export async function renderWikitext(
    wt: string,
    opts?: ApiParseParams,
): Promise<string> {
    const api = new mw.Api();
    const html = await api.parse(wt, opts);
    return $(html).find("div.mw-parser-output").html();
}

export function log(message: string): void {
    if (!dhoptions.logging) {
        return;
    }
    console.log(`[${SCRIPT_NAME}]: ${message}`);
}

export function warn(message: string): void {
    if (!dhoptions.logging) {
        return;
    }
    console.warn(`[${SCRIPT_NAME}]: ${message}`);
}

export function error(message: string): void {
    if (!dhoptions.logging) {
        return;
    }
    console.error(`[${SCRIPT_NAME}]: ${message}`);
}
