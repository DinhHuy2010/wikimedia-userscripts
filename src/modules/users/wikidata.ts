import { NAMESPACE } from "../../constants.ts";
import { toContentNamespace } from "../../utils.ts";
import { fetchWDQS } from "../../wikidata/sparql.ts";
import { getWikiInfo } from "../../wikis/index.ts";

const PORTLET_ID = "p-dhuserinotherprojects";

async function getWikidataItem(username: string): Promise<string | null> {
    const sparql = `
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
SELECT ?item WHERE { ?item wdt:P4174 "${username}". }
LIMIT 1`;
    const data = await fetchWDQS(sparql);
    if (data.results.bindings.length === 0) {
        return null; // No item found
    }
    const uri = data.results.bindings[0].item.value;
    const m = /Q[1-9]\d*/.exec(uri);
    if (!m) {
        return null; // No valid QID found
    }
    return m[0] as string;
}

function initPortlet(): void {
    if ($("#" + PORTLET_ID).length !== 0) {
        return; // Portlet already exists
    }
    mw.util.addPortlet(
        PORTLET_ID,
        mw.msg("mw-dhscript-users-wikidata-otherprojects-label"),
        "#p-wikibase-otherprojects",
    );
}

async function getSitelinks(qid: string): Promise<{
    [key: string]: {
        site: string;
        title: string;
        badges: string[];
    };
}> {
    const api = new mw.ForeignApi("https://www.wikidata.org/w/api.php");
    const params = {
        action: "wbgetentities",
        ids: qid,
        format: "json",
        props: "sitelinks",
        formatversion: "2",
    };
    const response = await api.get(params);
    return response?.entities?.[qid]?.sitelinks || null;
}

async function addLinks(qid: string): Promise<void> {
    const sitelinks = await getSitelinks(qid);
    if (!sitelinks) {
        return; // No sitelinks found
    }
    const wikidataLink =
        `https://www.wikidata.org/wiki/Special:EntityPage/${qid}`;
    mw.util.addPortletLink(
        PORTLET_ID,
        wikidataLink,
        mw.msg("mw-dhscript-users-wikidata-otherprojects-wikidata-item-label"),
        `${PORTLET_ID}-wd-item`,
        mw.msg(
            "mw-dhscript-users-wikidata-otherprojects-wikidata-item-description",
        ),
        "g",
    );
    Object.values(sitelinks).forEach(async (link) => {
        const site = link.site;
        const title = link.title;
        const wi = await getWikiInfo(site);
        const rurl = wi?.url;
        if (!rurl) {
            return; // No URL found for this site
        }
        const url = new URL(rurl);
        url.pathname = `/wiki/${mw.util.wikiUrlencode(title)}`;
        mw.util.addPortletLink(
            PORTLET_ID,
            url.toString(),
            wi?.label || site,
            `${PORTLET_ID}-wd-${site}`,
            mw.msg(
                "mw-dhscript-users-wikidata-otherprojects-sitelink-description",
                wi?.label || site,
            ),
        );
    });
}

export async function initWikidata(): Promise<void> {
    if (toContentNamespace(NAMESPACE) !== 2) {
        return; // Not a user page
    }
    initPortlet();
    const username = mw.config.get("wgTitle").split("/")[0];
    const qid = await getWikidataItem(username);
    if (qid) {
        addLinks(qid);
    }
}
