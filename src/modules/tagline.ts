import { error, log, renderWikitext } from "../utils.ts";

const SITESUB_SELECTOR = "#siteSub";

export enum SiteSubEnum {
    /**
     * Hide the siteSub, even if it is shown by default.
     */
    HIDE = 0,
    /**
     * Show the default siteSub, even if it is hidden by default.
     */
    SHOW = 1,
    /**
     * Use the default siteSub option (aka do not change anything).
     */
    USE_DEFAULT = 2,
    /**
     * Use a custom siteSub wikitext.
     */
    USE_CUSTOM = 3,
}

function hidesiteSub(): void {
    log("Hiding siteSub...");
    $(SITESUB_SELECTOR).hide();
}

function showsiteSub(): void {
    log("Showing siteSub...");
    $(SITESUB_SELECTOR).show();
}

function setsiteSub(html: string): void {
    log("Setting siteSub...");
    $(SITESUB_SELECTOR).html(html);
}

function setsiteSubbyWikitext(wikitext: string): void {
    renderWikitext(wikitext)
        .then((html) => {
            setsiteSub(html);
        })
        .catch((err) => {
            error(`Error rendering wikitext: ${err}`);
        })
        .finally(() => {
            log("siteSub set by wikitext.");
        });
}

export function setsiteSubByStatus(
    siteSub: {
        status: SiteSubEnum;
        wikitext?: string;
    },
): void {
    log("Setting siteSub by status...");
    const { status, wikitext } = siteSub;
    switch (status) {
        case SiteSubEnum.USE_DEFAULT:
            // Do nothing, use the default siteSub options
            log("Using default siteSub options, doing nothing...");
            return;
        case SiteSubEnum.HIDE:
            hidesiteSub();
            return;
        case SiteSubEnum.SHOW:
            showsiteSub();
            return;
        case SiteSubEnum.USE_CUSTOM:
            if (wikitext) {
                log("Using custom siteSub wikitext...");
                setsiteSubbyWikitext(wikitext);
            } else {
                log("No wikitext provided for custom siteSub, doing nothing...");
            }
            return;
        default:
            log(`Unknown siteSub status: ${status}`);
            return;
    }
}

export function setsiteSubByPredicate(
    predicate: () => { status: SiteSubEnum; wikitext?: string },
): void {
    const o = predicate();
    setsiteSubByStatus(o);
}
