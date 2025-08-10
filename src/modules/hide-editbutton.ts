import { isTalkNamespace } from "./utils.ts";

function hideEditButton(): void {
    $("#ca-edit").hide();
}

export function hideEditButtonOnDiscussionPages(): void {
    if (isTalkNamespace(mw.config.get("wgNamespaceNumber"))) {
        hideEditButton();
    }
}
