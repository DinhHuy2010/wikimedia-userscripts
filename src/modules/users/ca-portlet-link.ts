import { toContentNamespace, warn } from "../../utils.ts";
import { extractGlobalUserInfo } from "./utils.ts";
import { ApiQueryParams } from "../../types.ts";
import { DATABASE_NAME, NAMESPACE } from "../../constants.ts";
import { getWikiInfo, getWikiInfoSync } from "../../wikis.ts";

function addCentralAuthLink(username: string): void {
    const caLink = `https://meta.wikimedia.org/wiki/${
        mw.util.wikiUrlencode(`Special:CentralAuth/${username}`)
    }`;
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

async function addUserPageLink(link: {
    type: "local" | "global";
    url: string;
    home?: string;
}): Promise<void> {
    const label = link.type === "local"
        ? `User page at ${
            (await getWikiInfo(link.home || "metawiki"))?.label || "????"
        }`
        : "Global user page at Meta-Wiki";
    const tooltip = link.type === "local"
        ? `View this user page at this user's home wiki`
        : "View this global user page at Meta-Wiki";
    mw.util.addPortletLink(
        "p-tb",
        link.url,
        label,
        `t-userpage-${link.type}-${link.home || "metawiki"}`,
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
    const base_url = getWikiInfoSync(home)?.url;
    async function doesNotHaveLocalPage(url: string): Promise<boolean> {
        const f = new mw.ForeignApi(`${url}w/api.php`);
        const out = await f.get(p);
        const result = out.query?.pages?.[0];
        return result?.invalid || result?.missing === true;
    }
    if (DATABASE_NAME === "metawiki") {
        // In Meta-Wiki, add a link to the user's page on their home wiki, if exists
        if (home === "metawiki") {
            // Home wiki is Meta-Wiki, return empty array
            return [];
        }
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
        // Not in Meta-Wiki
        const doesLocalPageExist =
            !(await doesNotHaveLocalPage(base_url || ""));
        const doesMetaPageExist =
            !(await doesNotHaveLocalPage("https://meta.wikimedia.org/"));
        const links: {
            type: "local" | "global";
            url: string;
            home?: string;
        }[] = [];
        if (doesMetaPageExist) {
            links.push({
                type: "global",
                url: `https://meta.wikimedia.org/wiki/User:${username}`,
            });
        }
        if (DATABASE_NAME !== home && home !== "metawiki") {
            // Not in home wiki, add local link if it exists
            if (doesLocalPageExist) {
                links.push({
                    type: "local",
                    url: `${base_url}wiki/User:${username}`,
                    home: home,
                });
            }
        }
        return links;
    }
}

export async function addCaPortlet(): Promise<void> {
    if (toContentNamespace(NAMESPACE) !== 2) {
        return;
    }
    const username = mw.config.get("wgTitle").split("/")[0];
    const userinfo = await extractGlobalUserInfo(username);
    if (userinfo !== null) {
        addCentralAuthLink(username);
        const links = await getUserPageLinks(userinfo.home, userinfo.name);
        links.forEach(addUserPageLink);
    }
}
