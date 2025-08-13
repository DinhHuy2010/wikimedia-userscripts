import { toContentNamespace, warn } from "../../utils.ts";
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
        ? `User page at ${wikis[link.home || ""]?.label}`
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

async function getUserPageLinks(home: string, username: string): Promise<
    {
        type: "local" | "global";
        url: string;
        home?: string;
    }[]
> {
    const p: ApiQueryParams = {
        "action": "query",
        "format": "json",
        "formatversion": "2",
        "titles": "User:" + username,
    };
    async function doesNotHaveLocalPage(url: string): Promise<boolean> {
        const f = new mw.ForeignApi(`${url}w/api.php`);
        const out = await f.get(p);
        return out.query?.pages?.[0]?.missing === true;
    }
    if (DATABASE_NAME === "metawiki") {
        // In Meta-Wiki, add a link to the user's page on their home wiki, if exists
        if (home === "metawiki") {
            // Home wiki is Meta-Wiki, return empty array
            return [];
        }
        const base_url = wikis[home]?.url;
        if (!base_url) {
            warn(`No URL found for home wiki: ${home}`);
            return [];
        }
        if (await doesNotHaveLocalPage(base_url)) {
            // No local user page, return empty array
            return [];
        }
        return [{
            type: "local",
            url: `${base_url}wiki/User:${username}`,
            home: home,
        }];
    } else {
        // Not in Meta-Wiki, return a global link
        const doesLocalPageExist =
            !(await doesNotHaveLocalPage(wikis[home]?.url || ""));
        const doesMetaPageExist =
            !(await doesNotHaveLocalPage("https://meta.wikimedia.org/"));
        const links: {
            type: "local" | "global";
            url: string;
            home?: string;
        }[] = [];
        if (doesLocalPageExist && doesMetaPageExist) {
            links.push({
                type: "global",
                url: `https://meta.wikimedia.org/wiki/User:${username}`,
            });
        }
        if (DATABASE_NAME !== home && home !== "metawiki") {
            // Not in home wiki, add local link if it exists
            // Also global link already added so skip if home wiki is Meta-Wiki
            if (doesLocalPageExist) {
                links.push({
                    type: "local",
                    url: `${wikis[home]?.url}wiki/User:${username}`,
                    home: home,
                });
            }
        }
        return links;
    }
}

export function addCaPortlet() {
    function main() {
        const username = mw.config.get("wgTitle").split("/")[0];
        const exists_promise = extractGlobalUserInfo(username);
        exists_promise.then((_: { home: string; name: string } | null) => {
            if (_ !== null) {
                addCentralAuthLink(username);
                getUserPageLinks(_.home, _.name).then(
                    (links) => {
                        links.forEach(addUserPageLink);
                    },
                );
            }
        });
    }
    if (toContentNamespace(mw.config.get("wgNamespaceNumber")) !== 2) {
        return;
    }
    main();
}
