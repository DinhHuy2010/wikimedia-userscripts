import { NAMESPACE } from "../constants.ts";
import { ApiQueryPagePropsParams } from "../types.ts";
import { isTalkNamespace, toContentNamespace } from "../utils.ts";

const BASE_PAGE_PROPS_API_PARAMS: ApiQueryPagePropsParams = {
    "action": "query",
    "format": "json",
    "prop": "pageprops",
    "formatversion": "2",
};

function hideEditButton(): void {
    $("#ca-edit").hide();
}

function hideViewSourceButton(): void {
    $("#ca-viewsource").hide();
}

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

async function shouldHideEditButton(): Promise<"edit" | "viewsource" | null> {
    const button = mw.config.get("wgIsProbablyEditable")
        ? "edit"
        : "viewsource";
    if (isTalkNamespace(NAMESPACE)) {
        return button;
    }
    if (await isNonTalkPageIsDiscussion(mw.config.get("wgTitle"), NAMESPACE)) {
        return button;
    }
    return null;
}

export function onPages(): void {
    const buttonToHidePromise = shouldHideEditButton();
    buttonToHidePromise.then((buttonToHide) => {
        if (buttonToHide === "edit") {
            hideEditButton();
        } else if (buttonToHide === "viewsource") {
            hideViewSourceButton();
        }
    });
}
