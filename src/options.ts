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
    scripts: {
        "XTools": {
            type: "external",
            script: {
                "sourcewiki": "mediawikiwiki",
                "title": "XTools/ArticleInfo.js",
            },
            wiki: "*",
        }, // [[mw:XTools]]
        "HotCat": {
            type: "external",
            script: {
                "sourcewiki": "mediawikiwiki",
                "title": "MediaWiki:Gadget-HotCat.js",
            },
            wiki: "*",
        }, // [[w:en:Wikipedia:HotCat]]
        "markblocked": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-markblocked.js",
            },
            wiki: "*",
        }, // [[w:en:Special:Gadgets#gadget-markblocked]]
        "purgetab": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-purgetab.js",
            },
            wiki: "*",
        }, // [[w:en:Special:Gadgets#gadget-purgetab]]
        "revisionjumper": {
            type: "external",
            script: {
                sourcewiki: "dewiki",
                title: "MediaWiki:Gadget-revisionjumper.js",
            },
            wiki: "*",
        }, // [[w:en:User:DerHexer/revisionjumper]]
        "TwinkleGlobal": {
            type: "external",
            script: {
                sourcewiki: "metawiki",
                title: "User:Xiplus/TwinkleGlobal/load.js",
            },
            wiki: "*",
        }, // [[m:User:Xiplus/TwinkleGlobal]]
        "exlinks": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-exlinks.js",
            },
            wiki: "*",
        },
        "ClaimMaps": {
            type: "external",
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Teester/ClaimMaps.js",
            },
            wiki: ["wikidatawiki"],
        },
        "DisplayColourSwatches": {
            type: "external",
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Nikki/DisplayColourSwatches.js",
            },
            wiki: ["wikidatawiki"],
        },
        "User:Lectrician1/embeds.js": {
            type: "external",
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Lectrician1/embeds.js",
            },
            wiki: ["wikidatawiki"],
        },
        "User:Lockal/EditSum.js": {
            type: "external",
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Lockal/EditSum.js",
            },
            wiki: ["wikidatawiki"],
        },
        "Ultraviolet": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "User:10nm/beta.js",
            },
            wiki: ["enwiki"],
        },
        "CiteHighlighter": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "User:Novem Linguae/Scripts/CiteHighlighter.js",
            },
            wiki: ["enwiki"],
        },
        "sectionLinks.js": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "User:Hilst/Scripts/sectionLinks.js",
            },
            wiki: ["enwiki"],
        },
        "RTRC": {
            type: "external",
            script: () => {
                // Copied from https://meta.wikimedia.org/w/index.php?title=User:Krinkle/Tools/Real-Time_Recent_Changes&oldid=28838081
                // [[File:Krinkle_RTRC.js]]
                mw.loader.getState("ext.gadget.rtrc")
                    ? mw.loader.load("ext.gadget.rtrc")
                    : mw.loader.load(
                        "https://www.mediawiki.org/w/load.php?modules=ext.gadget.rtrc&lang=" +
                            mw.config.get("wgUserLanguage", "en"),
                    );
            },
            "wiki": ["wikidatawiki", "commonswiki"],
        },
        "MoveToDraft": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "User:MPGuy2824/MoveToDraft.js",
            },
            wiki: ["enwiki"],
        },
        // Internal scripts
        "CascadiaMonoLoader": {
            type: "internal",
            script: loadCascadiaMonoFont,
            wiki: "*",
        },
        "changeTalktoDiscussion": {
            type: "internal",
            script: changeTalktoDiscussion,
            wiki: ["enwiki"],
        },
        "setDisambiguationLabel": {
            type: "internal",
            script: setDisambiguationLabel,
            wiki: "*",
        },
        "addCaPortlet": {
            type: "internal",
            script: addCaPortlet,
            wiki: "*",
        },
        "users-wikidata": {
            type: "internal",
            script: initWikidata,
            wiki: "*",
        },
        "hide-editbutton-discussion": {
            type: "internal",
            script: onPages,
            "wiki": "*",
        },
        "forcetagineshow": {
            type: "internal",
            script: executeToEnforce,
            "wiki": "*",
        },
        "enwiki-specific": {
            type: "internal",
            script: executeOnEnWiki,
            wiki: ["enwiki"],
        },
    },
    logging: true,
};
