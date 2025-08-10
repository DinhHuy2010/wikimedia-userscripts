import { isTalkNamespace } from "./utils.ts";

function hideEditButton(): void {
    $("#ca-edit").hide();
}

function hideViewSourceButton(): void {
    $("#ca-viewsource").hide();
}

function shouldHideEditButton(): "edit" | "viewsource" | null {
    if (isTalkNamespace(mw.config.get("wgNamespaceNumber"))) {
        return "edit";
    }
    if (mw.config.get("wgNamespaceNumber") == 8) {
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
