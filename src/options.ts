import { Configuration } from "./types.ts";
import { loadCascadiaMonoFont } from "./modules/font-loader.ts";
import { executeOnEnWiki } from "./modules/enwiki.ts";
import { executeToEnforce } from "./modules/forcetagineshow.ts";
import { changeTalktoDiscussion } from "./modules/discussion.ts";
import { setDisambiguationLabel } from "./modules/disambiguation.ts";
import { addCaPortlet } from "./modules/users/ca-portlet-link.ts";
import { initWikidata } from "./modules/users/wikidata.ts";
import { onPages } from "./modules/onpages.ts";
import { validOnAnything, validOnWiki } from "./filters/index.ts";

export const dhoptions: Configuration = {
    scripts: {
        "XTools": {
            type: "external",
            script: {
                "sourcewiki": "mediawikiwiki",
                "title": "XTools/ArticleInfo.js",
            },
            filter: validOnAnything(),
        }, // [[mw:XTools]]
        "HotCat": {
            type: "external",
            script: {
                "sourcewiki": "mediawikiwiki",
                "title": "MediaWiki:Gadget-HotCat.js",
            },
            filter: validOnAnything(),
        }, // [[w:en:Wikipedia:HotCat]]
        "markblocked": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-markblocked.js",
            },
            filter: validOnAnything(),
        }, // [[w:en:Special:Gadgets#gadget-markblocked]]
        "purgetab": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-purgetab.js",
            },
            filter: validOnAnything(),
        }, // [[w:en:Special:Gadgets#gadget-purgetab]]
        "revisionjumper": {
            type: "external",
            script: {
                sourcewiki: "dewiki",
                title: "MediaWiki:Gadget-revisionjumper.js",
            },
            filter: validOnAnything(),
        }, // [[w:en:User:DerHexer/revisionjumper]]
        "TwinkleGlobal": {
            type: "external",
            script: {
                sourcewiki: "metawiki",
                title: "User:Xiplus/TwinkleGlobal/load.js",
            },
            filter: validOnAnything(),
        }, // [[m:User:Xiplus/TwinkleGlobal]]
        "exlinks": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "MediaWiki:Gadget-exlinks.js",
            },
            filter: validOnAnything(),
        },
        "ClaimMaps": {
            type: "external",
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Teester/ClaimMaps.js",
            },
            filter: validOnWiki("wikidatawiki"),
        },
        "DisplayColourSwatches": {
            type: "external",
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Nikki/DisplayColourSwatches.js",
            },
            filter: validOnWiki("wikidatawiki"),
        },
        "User:Lectrician1/embeds.js": {
            type: "external",
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Lectrician1/embeds.js",
            },
            filter: validOnWiki("wikidatawiki"),
        },
        "User:Lockal/EditSum.js": {
            type: "external",
            script: {
                sourcewiki: "wikidatawiki",
                title: "User:Lockal/EditSum.js",
            },
            filter: validOnWiki("wikidatawiki"),
        },
        "Ultraviolet": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "User:10nm/beta.js",
            },
            filter: validOnWiki("enwiki"),
        },
        "CiteHighlighter": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "User:Novem Linguae/Scripts/CiteHighlighter.js",
            },
            filter: validOnWiki("enwiki"),
        },
        "sectionLinks.js": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "User:Hilst/Scripts/sectionLinks.js",
            },
            filter: validOnWiki("enwiki"),
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
            filter: validOnWiki(["wikidatawiki", "commonswiki"]),
        },
        "MoveToDraft": {
            type: "external",
            script: {
                sourcewiki: "enwiki",
                title: "User:MPGuy2824/MoveToDraft.js",
            },
            filter: validOnWiki("enwiki"),
        },
        // Internal scripts
        "CascadiaMonoLoader": {
            type: "internal",
            script: loadCascadiaMonoFont,
            filter: validOnAnything(),
        },
        "changeTalktoDiscussion": {
            type: "internal",
            script: changeTalktoDiscussion,
            filter: validOnWiki("enwiki"),
        },
        "setDisambiguationLabel": {
            type: "internal",
            script: setDisambiguationLabel,
            filter: validOnAnything(),
        },
        "addCaPortlet": {
            type: "internal",
            script: addCaPortlet,
            filter: validOnAnything(),
        },
        "users-wikidata": {
            type: "internal",
            script: initWikidata,
            filter: validOnAnything(),
        },
        "hide-editbutton-discussion": {
            type: "internal",
            script: onPages,
            filter: validOnAnything(),
        },
        "forcetagineshow": {
            type: "internal",
            script: executeToEnforce,
            filter: validOnAnything(),
        },
        "enwiki-specific": {
            type: "internal",
            script: executeOnEnWiki,
            filter: validOnWiki("enwiki"),
        },
    },
    logging: true,
};
