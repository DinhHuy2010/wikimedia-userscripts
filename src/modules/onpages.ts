import { isTalkNamespace } from "./utils.ts";

function hideEditButton(): void {
    $("#ca-edit").hide();
}

function shouldHideEditButton(): boolean {
    if (isTalkNamespace(mw.config.get("wgNamespaceNumber"))) {
        return true;
    }
    if (mw.config.get("wgNamespaceNumber") == 8) {
        // MediaWiki namespace
        return !mw.config.get("wgIsProbablyEditable");
    }
    return false;
}

export function onPages(): void {
    if (shouldHideEditButton()) {
        hideEditButton();
    }
}
