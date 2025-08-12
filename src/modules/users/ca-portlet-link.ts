import { toContentNamespace, warn } from "../utils.ts";
import { extractGlobalUserInfo } from "./utils.ts";
import _wikis from "../../wikis.json" with { type: "json" };
import { ApiQueryParams, Wikis } from "../../types.ts";
import { DATABASE_NAME } from "../../constants.ts";

const wikis = _wikis as Wikis;

function addCentralAuthLink(username: string): void {
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

function addUserPageLink(link: {
    type: "local" | "global";
    url: string;
    home?: string;
}): void {
    if (link === null) {
        return;
    }
    const label = link.type === "local"
        ? `${link.home} user page`
        : "Global user page at Meta-Wiki";
    const tooltip = link.type === "local"
        ? `View this user page at this user's home wiki`
        : "View this global user page at Meta-Wiki";
    mw.util.addPortletLink(
        "p-tb",
        link.url,
        label,
        `t-userpage-${link.type}`,
        tooltip,
        undefined,
        "#t-ca",
    );
}

async function getUserPageLink(home: string, username: string): Promise<
    {
        type: "local" | "global";
        url: string;
        home?: string;
    } | null
> {
    const p: ApiQueryParams = {
        "action": "query",
        "format": "json",
        "formatversion": "2",
        "titles": "User:" + username,
    };
    if (DATABASE_NAME === "metawiki") {
        // In Meta-Wiki, add a link to the user's page on their home wiki, if exists
        const base_url = wikis[home]?.url;
        if (!base_url) {
            warn(`No URL found for home wiki: ${home}`);
            return null;
        }
        const f = new mw.ForeignApi(`${base_url}/w/api.php`);
        const out = await f.get(p);
        if (out.query?.pages?.[0]?.missing) {
            return null;
        }
        return {
            type: "local",
            url: `${base_url}/wiki/User:${username}`,
            home: home,
        };
    } else {
        // Not in Meta-Wiki, return a global link
        const f = new mw.ForeignApi("https://meta.wikimedia.org/w/api.php");
        const out = await f.get(p);
        if (out.query?.pages?.[0]?.missing) {
            // No Meta-Wiki user page
            return null;
        }
        return {
            type: "global",
            url: `https://meta.wikimedia.org/wiki/User:${username}`,
        };
    }
}

export function addCaPortlet() {
    function main() {
        const username = mw.config.get("wgTitle").split("/")[0];
        const exists_promise = extractGlobalUserInfo(username);
        exists_promise.then((_: { home: string; name: string } | null) => {
            if (_ !== null) {
                addCentralAuthLink(username);
                getUserPageLink(_.home, _.name).then(
                    (_) => {
                        if (_ === null) {
                            return;
                        }
                        addUserPageLink(_);
                    },
                );
            }
        });
    }
    if (toContentNamespace(mw.config.get("wgNamespaceNumber")) !== 2) {
        return;
    }
    mw.loader.using("mediawiki.api", main);
}
