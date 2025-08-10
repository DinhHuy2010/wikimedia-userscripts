import { Configuration } from "./types.ts";
import { loadCascadiaMonoFont } from "./modules/font-loader.ts";
import { executeOnEnWiki } from "./modules/enwiki.ts";
import { executeOnAllWikis } from "./modules/allwiki.ts";
import { changeTalktoDiscussion } from "./modules/discussion.ts";
import { setDisambiguationLabel } from "./modules/disambiguation.ts";
import { addCaPortlet } from "./modules/users/ca-portlet-link.ts";
import { initWikidata } from "./modules/users/wikidata.ts";
import { onPages } from "./modules/onpages.ts";

export const dhoptions: Configuration = {
    external_scripts: {
        "XTools": { script: "mw:XTools/ArticleInfo.js", wiki: "*" }, // [[mw:XTools]]
        "HotCat": { script: "mw:MediaWiki:Gadget-HotCat.js", wiki: "*" }, // [[w:en:Wikipedia:HotCat]]
        "markblocked": {
            script: "w:en:MediaWiki:Gadget-markblocked.js",
            wiki: "*",
        }, // [[w:en:Special:Gadgets#gadget-markblocked]]
        "purgetab": { script: "w:en:MediaWiki:Gadget-purgetab.js", wiki: "*" }, // [[w:en:Special:Gadgets#gadget-purgetab]]
        "revisionjumper": {
            script: "w:de:MediaWiki:Gadget-revisionjumper.js",
            wiki: "*",
        }, // [[w:en:User:DerHexer/revisionjumper]]
        "TwinkleGlobal": {
            script: "m:User:Xiplus/TwinkleGlobal/load.js",
            wiki: "*",
        }, // [[m:User:Xiplus/TwinkleGlobal]]
        "exlinks": {
            script: "w:en:MediaWiki:Gadget-exlinks.js",
            wiki: "*",
        },
        "ClaimMaps": {
            script: "d:User:Teester/ClaimMaps.js",
            wiki: ["wikidatawiki"],
        },
        "DisplayColourSwatches": {
            script: "d:User:Nikki/DisplayColourSwatches.js",
            wiki: ["wikidatawiki"],
        },
        "User:Lectrician1/embeds.js": {
            script: "d:User:Lectrician1/embeds.js",
            wiki: ["wikidatawiki"],
        },
        "User:Lockal/EditSum.js": {
            script: "d:User:Lockal/EditSum.js",
            wiki: ["wikidatawiki"],
        },
        "Ultraviolet": {
            script: "w:en:User:10nm/beta.js",
            wiki: ["enwiki"],
        },
        "CiteHighlighter": {
            script: "w:en:User:Novem Linguae/Scripts/CiteHighlighter.js",
            wiki: ["enwiki"],
        },
        "sectionLinks.js": {
            script: "w:en:User:Hilst/Scripts/sectionLinks.js",
            wiki: ["enwiki"],
        },
    },
    internal_scripts: {
        "CascadiaMonoLoader": {
            script: loadCascadiaMonoFont,
            wiki: "*",
        },
        "changeTalktoDiscussion": {
            script: changeTalktoDiscussion,
            wiki: ["enwiki"],
        },
        "setDisambiguationLabel": {
            script: setDisambiguationLabel,
            wiki: "*",
        },
        "addCaPortlet": {
            script: addCaPortlet,
            wiki: "*",
        },
        "users-wikidata": {
            script: initWikidata,
            wiki: "*",
        },
        "hide-editbutton-discussion": {
            script: onPages,
            "wiki": "*",
        }
    },
    specific_scripts_on_wikis: {
        "enwiki": executeOnEnWiki,
        "*": executeOnAllWikis,
    },
    logging: true,
};
