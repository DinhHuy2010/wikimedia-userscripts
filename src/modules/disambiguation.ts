import { NAMESPACE } from "../constants.ts";
import { setTabLabel } from "./tabs.ts";
import { getPageProps, log, toContentNamespace } from "../utils.ts";

async function isPageDisambiguation(
    title: string,
    ns: number,
): Promise<boolean> {
    const contentNS = toContentNamespace(ns);
    const props = await getPageProps(
        `${mw.config.get("wgFormattedNamespaces")[contentNS]}:${title}`,
    );
    const isDisambig = props.disambiguation === "";
    return isDisambig;
}

export async function setDisambiguationLabel(): Promise<void> {
    const isDisambig = await isPageDisambiguation(
        mw.config.get("wgTitle"),
        NAMESPACE,
    );
    if (isDisambig) {
        log(mw.msg("mw-dhscript-setting-disambiguation-page"));
        setTabLabel(mw.msg("mw-dhscript-disambiguation-tab"));
    }
}
