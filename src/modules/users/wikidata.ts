import { NAMESPACE } from "../../constants.ts";
import { toContentNamespace } from "../../utils.ts";

const PORTLET_ID = "p-dhuserinotherprojects";

async function getWikidataItem(username: string): Promise<string | null> {
    const sparql = `
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
SELECT ?item WHERE { ?item wdt:P4174 "${username}". }
LIMIT 1`;
    const url = new URL("https://query.wikidata.org/sparql");
    url.searchParams.append("query", sparql);
    const response = await fetch(url, {
        headers: {
            "Accept": "application/sparql-results+json",
        },
    });
    const data = await response.json();
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
        "User in other projects",
        "#p-wikibase-otherprojects",
    );
}

export function initWikidata(): void {
    if (toContentNamespace(NAMESPACE) !== 2) {
        return; // Not a user page
    }
    initPortlet();
    const username = mw.config.get("wgTitle").split("/")[0];
    getWikidataItem(username).then((qid) => {
        if (qid) {
            const wikidataLink =
                `https://www.wikidata.org/wiki/Special:EntityPage/${qid}`;
            mw.util.addPortletLink(
                PORTLET_ID,
                wikidataLink,
                "Wikidata item",
                `${PORTLET_ID}-wd-item`,
                "Link to user's linked Wikidata item",
                "g",
            );
        }
    });
}
