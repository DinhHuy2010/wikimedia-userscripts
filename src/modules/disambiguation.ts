import { DISAMBIGUATION_PAGE_API_QUERY } from "../constants.ts";
import { setTabLabel } from "./tabs.ts";
import { toContentNamespace } from "./utils.ts";

async function isPageDisambiguation(page: string): Promise<boolean> {
    const titleobj = mw.Title.newFromText(page);
    if (!titleobj) {
        throw new Error(`Invalid page name: ${page}`);
    }
    const query = structuredClone(DISAMBIGUATION_PAGE_API_QUERY);
    const contentNS = toContentNamespace(titleobj.getNamespaceId());
    const api = new mw.Api();
    query.titles = `${
        mw.config.get("wgFormattedNamespaces")[contentNS]
    }:${titleobj.getMainText()}`;
    const data = await api.get(query);
    const isDisambig =
        (data.query.pages[0].pageprops.disambiguation || null) === "";
    return isDisambig;
}

export async function setDisambiguationLabel(): Promise<void> {
    const isDisambig = await isPageDisambiguation(mw.config.get("wgPageName"));
    if (isDisambig) {
        setTabLabel("Disambiguation page");
    }
}
