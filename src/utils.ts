import { ApiParseParams, ApiQueryPagePropsParams } from "./types.ts";
import { SCRIPT_NAME } from "./constants.ts";
import { dhoptions } from "./options.ts";

export function isTalkNamespace(n: number): boolean {
    return n >= 0 && n % 2 === 1;
}

export function toContentNamespace(n: number): number {
    if (isTalkNamespace(n)) {
        return n - 1; // Convert talk namespace to content namespace
    }
    return n; // Return the same namespace if it's not a talk namespace
}

export function toTalkNamespace(n: number): number {
    if (!isTalkNamespace(n)) {
        return n + 1; // Convert content namespace to talk namespace
    }
    return n; // Return the same namespace if it's already a talk namespace
}

export async function renderWikitext(
    wt: string,
    opts?: ApiParseParams,
): Promise<string> {
    const api = new mw.Api();
    const html = await api.parse(wt, opts);
    return $(html).html();
}

export async function getPageProps(
    titles: string,
): Promise<Record<string, string>> {
    const api = new mw.Api();
    const params: ApiQueryPagePropsParams = {
        action: "query",
        prop: "pageprops",
        titles: titles,
        format: "json",
        formatversion: "2",
    };
    const response = await api.get(params);
    const pages = response.query.pages;
    if (pages && pages.length > 0 && pages[0].pageprops) {
        return pages[0].pageprops;
    }
    return {};
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

export function isOnMobileView(): boolean {
    // https://www.mediawiki.org/w/index.php?title=Extension:MobileFrontend&oldid=7816489#FAQ
    return $(".mw-mf").length !== 0;
}

export function isInMainPage(): boolean {
    if (mw.config.get("wgIsMainPage") === true) {
        return true;
    }
    if (mw.config.get("wgDBname") === "metawiki") {
        const title = mw.Title.newFromUserInput(mw.config.get("wgPageName"));
        if (title && title.getMain().split("/")[0] === "Main_Page") {
            return true;
        }
    }
    // Default to false if not on main page or unable to determine
    return false;
}
