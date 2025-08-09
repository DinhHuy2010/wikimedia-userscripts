// deno-lint-ignore-file no-explicit-any
import { CentralAuthApiQueryGlobalUserInfoParams } from "../../types.ts";
import _wikis from "../../wikis.json" with { type: "json" };

const WIKIS = _wikis as Record<string, string>;
const PORTLET_ID = "p-dhuserinotherprojects";

interface LocalAccount {
    name: string;
    portletID: string;
    link: string;
}

async function getLocalAccounts(username: string): Promise<LocalAccount[]> {
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
    gui.merged = gui.merged.filter((local: any) => local.editcount >= 1);
    const locals: LocalAccount[] = gui.merged.map((local: any) => {
        const wikiname = WIKIS[local.wiki] || local.wiki;
        return {
            name: wikiname,
            portletID: `${PORTLET_ID}-${local.wiki}`,
            link: `${local.url}/wiki/User:${name}`,
        };
    });
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

function fillPortletLinks(locals: LocalAccount[]): void {
    locals.forEach((element) => {
        mw.util.addPortletLink(
            PORTLET_ID,
            element.link,
            element.name,
            element.portletID,
            `Userpage in ${element.name}`,
            undefined,
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
