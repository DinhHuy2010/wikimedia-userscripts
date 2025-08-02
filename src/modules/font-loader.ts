import { CASCADIA_MONO_FONT_URL } from "../constants.ts";
import { log } from "./utils.ts";

export function loadCascadiaMonoFont(): void {
    log(`Loading Cascadia Mono font...`);
    const head = $("head");

    const link = document.createElement("link");
    // Preconnect to Google Fonts for performance
    link.rel = "preconnect";
    link.href = "https://fonts.googleapis.com";
    head.append(link);

    const l2 = document.createElement("link");
    l2.rel = "stylesheet";
    l2.href = "https://fonts.gstatic.com";
    l2.crossOrigin = "anonymous";
    $("head").append(l2);

    const fl = document.createElement("link");
    fl.rel = "stylesheet";
    fl.href = CASCADIA_MONO_FONT_URL.toString();
    $("head").append(fl);
}
