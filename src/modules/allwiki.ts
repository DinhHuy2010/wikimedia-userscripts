import {
    DATABASE_NAME,
    IS_IN_SPECIAL_NAMESPACE,
    IS_IN_WIKIDATA_DATA_NAMESPACE,
} from "../constants.ts";
import { setsiteSubByPredicate, SiteSubEnum } from "./tagline.ts";

function forceShowTagline(): { status: SiteSubEnum } {
    if (IS_IN_SPECIAL_NAMESPACE) {
        return { status: SiteSubEnum.HIDE };
    }
    if (IS_IN_WIKIDATA_DATA_NAMESPACE) {
        return { status: SiteSubEnum.HIDE };
    }
    if (mw.config.get("wgIsMainPage") === true) {
        return { status: SiteSubEnum.HIDE };
    }
    if (
        DATABASE_NAME === "metawiki"
    ) {
        const title = mw.Title.newFromUserInput(mw.config.get("wgPageName"));
        if (title && title.getMain().split("/")[0] === "Main_Page") {
            return { status: SiteSubEnum.HIDE };
        }
    }
    return { status: SiteSubEnum.USE_DEFAULT };
}

export function executeOnAllWikis(): void {
    setsiteSubByPredicate(forceShowTagline);
}
