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
    log(mw.msg("mw-dhscript-tagline-hide-sitesub"));
    $(SITESUB_SELECTOR).hide();
}

function showsiteSub(): void {
    log(mw.msg("mw-dhscript-tagline-show-sitesub"));
    $(SITESUB_SELECTOR).show();
}

function setsiteSub(html: string): void {
    log(mw.msg("mw-dhscript-tagline-set-sitesub"));
    $(SITESUB_SELECTOR).html(html);
}

async function setsiteSubbyWikitext(wikitext: string): Promise<void> {
    try {
        const html = await renderWikitext(wikitext);
        setsiteSub(html);
    } catch (err) {
        error(mw.msg("mw-dhscript-tagline-wikitext-render-error", err));
    } finally {
        log(mw.msg("mw-dhscript-tagline-wikitext-rendered"));
    }
}

export async function setsiteSubByStatus(
    siteSub: {
        status: SiteSubEnum;
        wikitext?: string;
    },
): Promise<SiteSubEnum> {
    log(mw.msg("mw-dhscript-tagline-set-sitesub-by-status"));
    const { status, wikitext } = siteSub;
    switch (status) {
        case SiteSubEnum.USE_DEFAULT:
            // Do nothing, use the default siteSub options
            log(mw.msg("mw-dhscript-tagline-set-sitesub-by-status-doing-nothing"));
            return Promise.resolve(SiteSubEnum.USE_DEFAULT);
        case SiteSubEnum.HIDE:
            hidesiteSub();
            return Promise.resolve(SiteSubEnum.HIDE);
        case SiteSubEnum.SHOW:
            showsiteSub();
            return Promise.resolve(SiteSubEnum.SHOW);
        case SiteSubEnum.USE_CUSTOM:
            if (wikitext) {
                log(mw.msg("mw-dhscript-tagline-set-sitesub-by-status-custom-wikitext"));
                await setsiteSubbyWikitext(wikitext);
                return Promise.resolve(SiteSubEnum.USE_CUSTOM);
            } else {
                log(mw.msg("mw-dhscript-tagline-set-sitesub-by-status-custom-wikitext-empty"));
                return Promise.resolve(SiteSubEnum.USE_DEFAULT);
            }
        default:
            log(mw.msg("mw-dhscript-tagline-set-sitesub-by-status-unknown-status", status));
            return Promise.resolve(SiteSubEnum.USE_DEFAULT);
    }
}

export async function setsiteSubByPredicate(
    predicate: () => { status: SiteSubEnum; wikitext?: string } | Promise<{ status: SiteSubEnum; wikitext?: string }>,
): Promise<void> {
    const o = await predicate();
    await setsiteSubByStatus(o);
}
