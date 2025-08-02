import {
    DATABASE_NAME,
    IS_IN_SPECIAL_NAMESPACE,
    IS_IN_WIKIDATA_DATA_NAMESPACE,
} from "../constants.ts";

function forceShowTagline(): void {
    if (
        !IS_IN_SPECIAL_NAMESPACE && !IS_IN_WIKIDATA_DATA_NAMESPACE &&
        (mw.config.get("wgIsMainPage") === true || (
            DATABASE_NAME === "metawiki" &&
            mw.config.get("wgPageName") !== "Main_Page"
        ))
    ) {
        // Force #siteSub to show on all pages except:
        //      Special pages
        //      Wikidata data namespaces
        //      Main page
        $("#siteSub").show();
    }
}

export function executeOnAllWikis(): void {
    forceShowTagline();
}
