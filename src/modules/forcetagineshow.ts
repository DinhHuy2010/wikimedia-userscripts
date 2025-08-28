import {
    IS_IN_SPECIAL_NAMESPACE,
    IS_IN_WIKIDATA_DATA_NAMESPACE,
} from "../constants.ts";
import { isInMainPage } from "../utils.ts";
import { setsiteSubByPredicate, SiteSubEnum } from "./tagline.ts";

function forceShowTagline(): { status: SiteSubEnum } {
    return (IS_IN_SPECIAL_NAMESPACE || IS_IN_WIKIDATA_DATA_NAMESPACE ||
            isInMainPage())
        ? { status: SiteSubEnum.HIDE }
        : { status: SiteSubEnum.USE_DEFAULT };
}

export function executeToEnforce(): void {
    setsiteSubByPredicate(forceShowTagline);
}
