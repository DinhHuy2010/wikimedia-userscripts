import { isTalkNamespace } from "../utils.ts";

function hideEditButton(): void {
    $("#ca-edit").hide();
}

function hideViewSourceButton(): void {
    $("#ca-viewsource").hide();
}

function shouldHideEditButton(): "edit" | "viewsource" | null {
    const ns = mw.config.get("wgNamespaceNumber");
    // MediaWiki talk does not have a "Add topic" button
    if (isTalkNamespace(ns) && ns !== 9) {
        return "edit";
    }
    if (ns == 8) {
        // MediaWiki namespace
        if (mw.config.get("wgIsProbablyEditable") === false) {
            return "viewsource";
        } else {
            return "edit";
        }
    }
    return null;
}

export function onPages(): void {
    const buttonToHide = shouldHideEditButton();
    if (buttonToHide === "edit") {
        hideEditButton();
    } else if (buttonToHide === "viewsource") {
        hideViewSourceButton();
    }
}
