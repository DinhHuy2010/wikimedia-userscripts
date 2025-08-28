import { NAMESPACE } from "../constants.ts";
import { getPageProps, isTalkNamespace, toContentNamespace } from "../utils.ts";

async function isTalkPage(
    title: string,
    ns: number,
): Promise<boolean> {
    if (!isTalkNamespace(ns)) {
        return false;
    }
    const props = await getPageProps(`${mw.config.get("wgFormattedNamespaces")[ns]}:${title}`);
    // __NONEWSECTIONLINK__ is set for talk pages that are not discussions
    // and thus should not have an "Add topic" button.
    return !(props?.nonewsectionlink === "");
}

async function isNonTalkPageIsDiscussion(
    title: string,
    ns: number,
): Promise<boolean> {
    const props = await getPageProps(`${mw.config.get("wgFormattedNamespaces")[toContentNamespace(ns)]}:${title}`);
    return props?.newsectionlink === "";
}

async function shouldHideEditButton(): Promise<string | null> {
    const button = "#ca-edit, #ca-viewsource, #ca-ve-edit";
    if (await isTalkPage(mw.config.get("wgTitle"), NAMESPACE)) {
        return button;
    }
    if (await isNonTalkPageIsDiscussion(mw.config.get("wgTitle"), NAMESPACE)) {
        return button;
    }
    return null;
}

export async function onPages(): Promise<void> {
    const selector = await shouldHideEditButton();
    if (selector) {
        $(selector).hide();
    }
}
