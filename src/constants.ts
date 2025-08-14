/**
 * @private
 * @description Constants used in the global script
 */

import { ApiQueryPagePropsParams, Wikis } from "./types.ts";
import _wikis from "./wikis.json" with { type: "json" };

const params = new URLSearchParams({
    family: "Cascadia Mono:ital@0;1",
    display: "swap",
});
const WIKIBASE_DATA_NS = [640, 120, 146, 0];

export const SCRIPT_NAME = "User:DinhHuy2010/global.js";
export const CASCADIA_MONO_FONT_URL = new URL(
    `https://fonts.googleapis.com/css2?${params.toString()}`,
); // Ensure the URL is valid and absolute
export const DISAMBIGUATION_PAGE_API_QUERY: ApiQueryPagePropsParams = {
    "action": "query",
    "format": "json",
    "prop": "pageprops",
    "formatversion": "2",
    "ppprop": "disambiguation",
};
export const DATABASE_NAME = mw.config.get("wgDBname");
export const NAMESPACE = mw.config.get("wgNamespaceNumber");
export const IS_IN_SPECIAL_NAMESPACE = NAMESPACE < 0;
export const IS_IN_WIKIDATA_DATA_NAMESPACE =
    WIKIBASE_DATA_NS.includes(NAMESPACE) &&
    mw.config.get("wgDBname") === "wikidatawiki";
export const VECTOR_SKINS = ["vector", "vector-2022"];
export const SKIN = mw.config.get("skin");
export const SKINS_FOR_VECTOR_SELECTOR = [...VECTOR_SKINS, "monobook"];
export const WIKIS = _wikis as Wikis;
