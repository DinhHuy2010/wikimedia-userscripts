import { NAMESPACE } from "../constants.ts";
import { isTalkNamespace } from "../utils.ts";

function hideEditButton(): void {
    $("#ca-edit").hide();
}

function hideViewSourceButton(): void {
    $("#ca-viewsource").hide();
}

function shouldHideEditButton(): "edit" | "viewsource" | null {
    // MediaWiki talk does not have a "Add topic" button
    if (isTalkNamespace(NAMESPACE) && NAMESPACE !== 9) {
        return "edit";
    }
    if (NAMESPACE == 8) {
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
