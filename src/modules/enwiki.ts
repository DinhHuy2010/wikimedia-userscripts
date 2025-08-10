import { SKIN, SKINS_FOR_VECTOR_SELECTOR } from "../constants.ts";
import { setsiteSubByPredicate, SiteSubEnum } from "./tagline.ts";
import { log } from "./utils.ts";

const DEFAULT_SITESUB = "{{User:DinhHuy2010/siteSub}}";

function updateViewLinksForCommons() {
    if (
        mw.config.get("wgNamespaceNumber") === 6 &&
        SKINS_FOR_VECTOR_SELECTOR.includes(SKIN)
    ) {
        $("#ca-view-foreign a").text("View on Wikimedia Commons");
        $("#ca-fileExporter a").text("Transfer to Wikimedia Commons");
    }
}

function getSiteSub(): {
    status: SiteSubEnum;
    wikitext?: string;
} {
    if (mw.config.get("wgNamespaceNumber") === 6) {
        return {
            status: SiteSubEnum.USE_CUSTOM,
            wikitext: "{{User:DinhHuy2010/siteSub/File}}",
        };
    } else if (mw.config.get("wgNamespaceNumber") === 0) {
        return { status: SiteSubEnum.USE_CUSTOM, wikitext: DEFAULT_SITESUB };
    } else {
        return { status: SiteSubEnum.HIDE };
    }
}

export function executeOnEnWiki(): void {
    log("Loading English Wikipedia specific userscripts...");
    updateViewLinksForCommons();
    setsiteSubByPredicate(getSiteSub);
}
