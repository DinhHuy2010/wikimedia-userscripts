import { DISAMBIGUATION_PAGE_API_QUERY } from "../constants.ts";
import { setTabLabel } from "./tabs.ts";
import { log, toContentNamespace } from "./utils.ts";

async function isPageDisambiguation(
    title: string,
    ns: number,
): Promise<boolean> {
    const query = structuredClone(DISAMBIGUATION_PAGE_API_QUERY);
    const contentNS = toContentNamespace(ns);
    const api = new mw.Api();
    query.titles = `${
        mw.config.get("wgFormattedNamespaces")[contentNS]
    }:${title}`;
    const data = await api.get(query);
    const isDisambig = data.query.pages[0].pageprops.disambiguation === "";
    return isDisambig;
}

export function setDisambiguationLabel(): void {
    async function updateTabForDisambiguation() {
        const isDisambig = await isPageDisambiguation(
            mw.config.get("wgTitle"),
            mw.config.get("wgNamespaceNumber"),
        );
        if (isDisambig) {
            log("Setting disambiguation label for the current tab...");
            setTabLabel("Disambiguation page");
        }
    }
    mw.loader.using("mediawiki.api").then(
        async () => {
            await updateTabForDisambiguation();
        },
    );
}
