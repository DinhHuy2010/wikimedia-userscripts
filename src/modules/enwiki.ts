import {
    DISAMBIGUATION_PAGE_API_QUERY,
    NAMESPACE,
    SKIN,
    VECTOR_SKINS,
} from "../constants.ts";
import {
    error,
    log,
    renderWikitext,
    toContentNamespace,
    warn,
} from "./utils.ts";

const CSS_SELECTOR_FOR_VECTOR = "li[id^='ca-nstab'] > a";
const CSS_SELECTOR_FOR_MINERVA =
    "a.minerva__tab-text[data-event-name^='tabs.']";
const CSS_SELECTOR_DISSCUSSION_BUTTION_FOR_VECTOR = "#ca-talk a";
const CSS_SELECTOR_DISSCUSSION_BUTTION_FOR_MINERVA =
    "a.minerva__tab-text[rel='discussion']";

const DEFAULT_SITESUB = "{{User:DinhHuy2010/siteSub}}";

function setDisamLabel() {
    log("Setting disambiguation label...");
    let selector: string;
    if (SKIN === "minerva") {
        selector = CSS_SELECTOR_FOR_MINERVA;
    } else if (VECTOR_SKINS.includes(SKIN)) {
        selector = CSS_SELECTOR_FOR_VECTOR;
    } else {
        warn(`Unsupported skin for disambiguation label: ${SKIN}`);
        return;
    }
    $(selector).text("Disambiguation page");
}
function setDisamLabelIfNeeded() {
    const query = structuredClone(DISAMBIGUATION_PAGE_API_QUERY);
    const contentNS = toContentNamespace(NAMESPACE);
    const api = new mw.Api();
    query.titles = `${mw.config.get("wgFormattedNamespaces")[contentNS]}:${
        mw.config.get("wgTitle")
    }`;
    api.get(query).then((data) => {
        const isDisambig = data.query.pages[0].pageprops.disambiguation === "";
        if (isDisambig) {
            setDisamLabel();
        }
    });
}

function changeTalktoDiscussion(): void {
    log("Changing 'Talk' to 'Discussion'...");
    let selector: string;
    if (SKIN === "minerva") {
        selector = CSS_SELECTOR_DISSCUSSION_BUTTION_FOR_MINERVA;
    } else if (VECTOR_SKINS.includes(SKIN)) {
        selector = CSS_SELECTOR_DISSCUSSION_BUTTION_FOR_VECTOR;
    } else {
        warn(`Unsupported skin for changing 'Talk' to 'Discussion': ${SKIN}`);
        return;
    }
    $(selector).text("Discussion");
}

function updateViewLinksForCommons() {
    if (mw.config.get("wgNamespaceNumber") === 6) {
        $("#ca-view-foreign a").text("View on Wikimedia Commons");
        $("#ca-fileExporter a").text("Transfer to Wikimedia Commons");
    }
}

function changesiteSub(wikitext: string): void {
    // Change tagline on the English Wikipedia

    renderWikitext(wikitext, {
        title: mw.config.get("wgPageName"),
    })
        .then((html) => $("#siteSub").html(html))
        .catch((err) => {
            error(
                `Error rendering wikitext: ${err}`,
            );
        });
}

function getSiteSub(): string {
    if (mw.config.get("wgNamespaceNumber") === 6) {
        return "{{User:DinhHuy2010/siteSub/File}}";
    } else {
        return DEFAULT_SITESUB;
    }
}

export function executeOnEnWiki(): void {
    log("Loading English Wikipedia specific userscripts...");
    changeTalktoDiscussion();
    updateViewLinksForCommons();
    mw.loader.using(["mediawiki.api"], () => {
        setDisamLabelIfNeeded();
        changesiteSub(getSiteSub());
    });
}
