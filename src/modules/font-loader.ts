import { CASCADIA_MONO_FONT_URL } from "../constants.ts";
import { log } from "./utils.ts";

const FONT_CSS = `@import url('${CASCADIA_MONO_FONT_URL}');`;

export function loadCascadiaMonoFont(): void {
    log(`Loading Cascadia Mono font...`);
    mw.util.addCSS(FONT_CSS);
}
