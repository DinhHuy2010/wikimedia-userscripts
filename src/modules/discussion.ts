import { SKIN, SKINS_FOR_VECTOR_SELECTOR } from "../constants.ts";
import { log, warn } from "../utils.ts";

const CSS_SELECTOR_DISSCUSSION_BUTTION_FOR_VECTOR = "#ca-talk a > span";
const CSS_SELECTOR_DISSCUSSION_BUTTION_FOR_MINERVA =
    "a.minerva__tab-text[rel='discussion']";

export function changeTalktoDiscussion(): void {
    log(mw.msg("mw-dhscript-discussion-setting-tab"));
    let selector: string;
    if (SKIN === "minerva") {
        selector = CSS_SELECTOR_DISSCUSSION_BUTTION_FOR_MINERVA;
    } else if (SKINS_FOR_VECTOR_SELECTOR.includes(SKIN)) {
        selector = CSS_SELECTOR_DISSCUSSION_BUTTION_FOR_VECTOR;
    } else {
        warn(mw.msg("mw-dhscript-discussion-set-tab-unsupported-skin", SKIN));
        return;
    }
    $(selector).text(mw.msg("mw-dhscript-discussion-tab"));
}
