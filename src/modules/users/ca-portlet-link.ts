import { toContentNamespace } from "../utils.ts";

export function addCaPortlet() {
    if (toContentNamespace(mw.config.get("wgNamespaceNumber")) !== 2) {
        return;
    }
    const username = mw.config.get("wgTitle");
    const caLink =
        `https://meta.wikimedia.org/wiki/Special:CentralAuth/${username}`;
    mw.util.addPortletLink(
        "p-tb",
        caLink,
        "Global account information",
        "t-ca",
        "View global account information of this user",
        undefined,
        "#t-log",
    );
}
