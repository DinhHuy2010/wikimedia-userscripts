import { NAMESPACE } from "../constants.ts";
import { ApiQueryPagePropsParams } from "../types.ts";
import { isTalkNamespace, toContentNamespace } from "../utils.ts";

const BASE_PAGE_PROPS_API_PARAMS: ApiQueryPagePropsParams = {
    "action": "query",
    "format": "json",
    "prop": "pageprops",
    "formatversion": "2",
};

async function isNonTalkPageIsDiscussion(
    title: string,
    ns: number,
): Promise<boolean> {
    const p = structuredClone(BASE_PAGE_PROPS_API_PARAMS);
    p.titles = `${
        mw.config.get("wgFormattedNamespaces")[toContentNamespace(ns)]
    }:${title}`;
    p.ppprop = "newsectionlink";
    const api = new mw.Api();
    const response = await api.get(p);
    return response.query?.pages[0].pageprops?.newsectionlink === "";
}

async function shouldHideEditButton(): Promise<string | null> {
    const button = "#ca-edit, #ca-viewsource, #ca-ve-edit";
    if (isTalkNamespace(NAMESPACE)) {
        return button;
    }
    if (await isNonTalkPageIsDiscussion(mw.config.get("wgTitle"), NAMESPACE)) {
        return button;
    }
    return null;
}

export function onPages(): void {
    const selectorPromise = shouldHideEditButton();
    selectorPromise.then((selector) => {
        if (selector) {
            $(selector).hide();
        }
    });
}
