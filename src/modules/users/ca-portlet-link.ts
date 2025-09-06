import { toContentNamespace, warn } from "../../utils.ts";
import { extractGlobalUserInfo } from "./utils.ts";
import { ApiQueryParams } from "../../types.ts";
import { DATABASE_NAME, NAMESPACE } from "../../constants.ts";
import { getWikiInfo } from "../../wikis/index.ts";

function addCentralAuthLink(username: string): void {
    const caLink = mw.msg(
        "mw-dhscript-users-ca-portlet-link-url",
        mw.util.wikiUrlencode(username),
    );
    mw.util.addPortletLink(
        "p-tb",
        caLink,
        mw.msg("mw-dhscript-users-ca-portlet-link-ca-label"),
        "t-ca",
        mw.msg("mw-dhscript-users-ca-portlet-link-ca-description"),
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
        ? mw.msg(
            "mw-dhscript-users-ca-portlet-link-local-label",
            (await getWikiInfo(link.home || "metawiki"))?.label || "????",
        )
        : mw.msg("mw-dhscript-users-ca-portlet-link-global-label");
    const tooltip = link.type === "local"
        ? mw.msg("mw-dhscript-users-ca-portlet-link-local-description")
        : mw.msg("mw-dhscript-users-ca-portlet-link-global-description");
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
    const encodedUsername = mw.util.wikiUrlencode(username);
    const p: ApiQueryParams = {
        "action": "query",
        "format": "json",
        "formatversion": "2",
        "titles": `User:${encodedUsername}`,
    };
    const base_url = (await getWikiInfo(home))?.url;
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
            warn(
                mw.msg(
                    "mw-dhscript-users-ca-portlet-link-nobaseurl-warning",
                    home,
                ),
            );
            return [];
        }
        if (await doesNotHaveLocalPage(base_url)) {
            // No local user page, return empty array
            return [];
        }
        return [{
            type: "local",
            url: `${base_url}wiki/User:${encodedUsername}`,
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
                url: mw.msg(
                    "mw-dhscript-users-ca-portlet-link-meta-userpage-url",
                    encodedUsername,
                ),
            });
        }
        if (DATABASE_NAME !== home && home !== "metawiki") {
            // Not in home wiki, add local link if it exists
            if (doesLocalPageExist) {
                links.push({
                    type: "local",
                    url: `${base_url}wiki/User:${encodedUsername}`,
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
