import { isTalkNamespace } from "./utils.ts";

function hideEditButton(): void {
    $("#ca-edit").hide();
}

export function onPages(): void {
    if (isTalkNamespace(mw.config.get("wgNamespaceNumber"))) {
        hideEditButton();
    }
}
