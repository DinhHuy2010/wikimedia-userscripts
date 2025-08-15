import { Configuration } from "./types.ts";
import { loadCascadiaMonoFont } from "./modules/font-loader.ts";
import { executeOnEnWiki } from "./modules/enwiki.ts";
import { executeToEnforce } from "./modules/forcetagineshow.ts";
import { changeTalktoDiscussion } from "./modules/discussion.ts";
import { setDisambiguationLabel } from "./modules/disambiguation.ts";
import { addCaPortlet } from "./modules/users/ca-portlet-link.ts";
import { initWikidata } from "./modules/users/wikidata.ts";
import { onPages } from "./modules/onpages.ts";

export const dhoptions: Configuration = {
    externalScripts: {
        "XTools": {
            script: {
                "sourcewiki": "mediawikiwiki",
                "title": "XTools/ArticleInfo.js",
            },
            wiki: "*",
        }, // [[mw:XTools]]
        "HotCat": {
            script: {
                "sourcewiki": "mediawikiwiki",
                "title": "MediaWiki:Gadget-HotCat.js",
            },
            wiki: "*",
        }, // [[w:en:Wikipedia:HotCat]]
        "markblocked": {
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-markblocked.js",
            },
            wiki: "*",
        }, // [[w:en:Special:Gadgets#gadget-markblocked]]
        "purgetab": {
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-purgetab.js",
            },
            wiki: "*",
        }, // [[w:en:Special:Gadgets#gadget-purgetab]]
        "revisionjumper": {
            script: {
                sourcewiki: "dewiki",
                title: "MediaWiki:Gadget-revisionjumper.js",
            },
            wiki: "*",
        }, // [[w:en:User:DerHexer/revisionjumper]]
        "TwinkleGlobal": {
            script: {
                sourcewiki: "metawiki",
                title: "User:Xiplus/TwinkleGlobal/load.js",
            },
            wiki: "*",
        }, // [[m:User:Xiplus/TwinkleGlobal]]
        "exlinks": {
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-exlinks.js",
            },
            wiki: "*",
        },
        "ClaimMaps": {
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Teester/ClaimMaps.js",
            },
            wiki: ["wikidatawiki"],
        },
        "DisplayColourSwatches": {
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Nikki/DisplayColourSwatches.js",
            },
            wiki: ["wikidatawiki"],
        },
        "User:Lectrician1/embeds.js": {
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Lectrician1/embeds.js",
            },
            wiki: ["wikidatawiki"],
        },
        "User:Lockal/EditSum.js": {
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Lockal/EditSum.js",
            },
            wiki: ["wikidatawiki"],
        },
        "Ultraviolet": {
            script: {
                sourcewiki: "enwiki",
                title: "User:10nm/beta.js",
            },
            wiki: ["enwiki"],
        },
        "CiteHighlighter": {
            script: {
                sourcewiki: "enwiki",
                title: "User:Novem Linguae/Scripts/CiteHighlighter.js",
            },
            wiki: ["enwiki"],
        },
        "sectionLinks.js": {
            script: {
                sourcewiki: "enwiki",
                title: "User:Hilst/Scripts/sectionLinks.js",
            },
            wiki: ["enwiki"],
        },
    },
    internalScripts: {
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
        },
        "forcetagineshow": {
            script: executeToEnforce,
            "wiki": "*",
        },
        "enwiki-specific": {
            script: executeOnEnWiki,
            wiki: ["enwiki"],
        },
    },
    logging: true,
};
