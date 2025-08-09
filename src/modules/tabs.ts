import { SKIN, SKINS_FOR_VECTOR_SELECTOR } from "../constants.ts";
import { warn } from "./utils.ts";

const CSS_SELECTOR_FOR_VECTOR = "li[id^='ca-nstab'] > a > span";
const CSS_SELECTOR_FOR_MINERVA =
    "a.minerva__tab-text[data-event-name^='tabs.']:not([rel='discussion'])";

export function setTabLabel(label: string): void {
    let selector: string;
    if (SKIN === "minerva") {
        selector = CSS_SELECTOR_FOR_MINERVA;
    } else if (SKINS_FOR_VECTOR_SELECTOR.includes(SKIN)) {
        selector = CSS_SELECTOR_FOR_VECTOR;
    } else {
        warn(`Unsupported skin for setting tab label: ${SKIN}`);
        return;
    }
    $(selector).text(label);
}
