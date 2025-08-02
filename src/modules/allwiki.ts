import {
    DATABASE_NAME,
    IS_IN_SPECIAL_NAMESPACE,
    IS_IN_WIKIDATA_DATA_NAMESPACE,
} from "../constants.ts";

function forceShowTagline(): void {
    if (IS_IN_SPECIAL_NAMESPACE) {
        return;
    }
    if (IS_IN_WIKIDATA_DATA_NAMESPACE) {
        return;
    }
    if (mw.config.get("wgIsMainPage") === true) {
        return;
    }
    if (DATABASE_NAME === "metawiki" && mw.config.get("wgPageName") !== "Main_Page") {
        return;
    }
    $("#siteSub").show();
}

export function executeOnAllWikis(): void {
    forceShowTagline();
}
