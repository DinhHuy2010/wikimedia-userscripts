// deno-lint-ignore-file no-explicit-any
import { DATABASE_NAME } from "../../constants.ts";
import { CentralAuthApiQueryGlobalUserInfoParams } from "../../types.ts";
import _wikis from "../../wikis.json" with { type: "json" };

const WIKIS = _wikis as Record<string, string>;
const PORTLET_ID = "p-dhuserinotherprojects";

interface UserOnOtherPages {
    name: string;
    portletID: string;
    link: string;
    tooltip?: string;
    accesskey?: string;
}

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

async function getLocalAccounts(
    username: string,
): Promise<UserOnOtherPages[]> {
    const f = new mw.ForeignApi("https://meta.wikimedia.org/w/api.php");
    const params: CentralAuthApiQueryGlobalUserInfoParams = {
        "action": "query",
        "format": "json",
        "meta": "globaluserinfo",
        "formatversion": "2",
        "guiuser": username,
        "guiprop": ["merged", "unattached"],
    };
    const results = await f.get(params);
    const gui = results.query.globaluserinfo;
    const name = gui.name;
    gui.merged = gui.merged || [];
    // Merge two statements into one
    gui.merged = gui.merged.filter(
        (local: any) => local.editcount >= 1 && local.wiki !== DATABASE_NAME,
    );
    const locals: UserOnOtherPages[] = gui.merged.map((local: any) => {
        const wikiname = WIKIS[local.wiki] || local.wiki;
        return {
            name: wikiname,
            portletID: `${PORTLET_ID}-${local.wiki}`,
            link: `${local.url}/wiki/User:${name}`,
        };
    });
    // Add Wikidata link if available
    const wikidataItem = await getWikidataItem(name);
    if (wikidataItem) {
        locals.push({
            name: "Wikidata item",
            portletID: `${PORTLET_ID}-wd-item`,
            link:
                `https://www.wikidata.org/wiki/Special:EntityPage/${wikidataItem}`,
            tooltip: "Link to user's linked Wikidata item",
            accesskey: "g",
        });
    }
    return locals;
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

function fillPortletLinks(locals: UserOnOtherPages[]): void {
    locals.forEach((element) => {
        mw.util.addPortletLink(
            PORTLET_ID,
            element.link,
            element.name,
            element.portletID,
            element.tooltip || `Userpage in ${element.name}`,
            element.accesskey,
        );
    });
}

export function initInterwiki(): void {
    if (mw.config.get("wgNamespaceNumber") !== 2) {
        return; // Not a user page
    }
    initPortlet();
    const username = mw.config.get("wgTitle").split("/")[0];
    mw.loader.using("mediawiki.api").then(() => {
        getLocalAccounts(username)
            .then(fillPortletLinks)
            .catch((error) => {
                console.error("Error fetching local accounts:", error);
                mw.notify(
                    "Error fetching user information from other projects.",
                    {
                        type: "error",
                    },
                );
            });
    });
}
