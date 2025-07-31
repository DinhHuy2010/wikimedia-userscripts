// User:DinhHuy2010/global.js
// This script is loaded on all Wikimedia projects.
// Copyright (c) 2025-present DinhHuy2010
// License: CC-BY-4.0

import type { ApiQueryPagePropsParams } from "types-mediawiki/api_params";

type MediaWikiType = typeof mediaWiki;
// {<string>: {script: <string> | <function>, wiki: <wiki>}}
// If string, use importScript(<string>);
// Else, execute the function directly.
type UserScriptRecord = {
    script: string | (() => void);
    wiki: string[] | "*";
};
type UserScriptsRecord = Record<string, UserScriptRecord>;

((jq: JQueryStatic, mediawiki: MediaWikiType) => {
    "use strict";
    // Load Cascadia Mono from Google Fonts
    const params = new URLSearchParams({
        family: "Cascadia Mono:ital@0;1",
        display: "swap",
    });
    const CASCADIA_MONO_FONT_URL = new URL(
        `https://fonts.googleapis.com/css2?${params.toString()}`,
    ); // Ensure the URL is valid and absolute
    const DISAMBIGUATION_PAGE_API_QUERY: ApiQueryPagePropsParams = {
        "action": "query",
        "format": "json",
        "prop": "pageprops",
        "formatversion": "2",
        "ppprop": "disambiguation",
    };
    const NS = mw.config.get("wgNamespaceNumber");
    const WIKIBASE_DATA_NS = [640, 120, 146, 0];
    const IS_IN_WIKIDATA_DATA_NAMESPACE = WIKIBASE_DATA_NS.includes(NS) &&
        mw.config.get("wgDBname") === "wikidatawiki";
    // "*" = All projects
    // "<wgDBname>" = Specific project
    const USERSCRIPTS: UserScriptsRecord = {
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
        "Shortdesc-helper": {
            script: () => {
                mediawiki.loader.getScript(
                    "https://en.wikipedia.org/w/load.php?modules=ext.gadget.libSettings",
                ).then(function () {
                    mediawiki.loader.load(
                        "https://en.wikipedia.org/w/load.php?modules=ext.gadget.Shortdesc-helper",
                    );
                });
            },
            wiki: ["enwiki"],
        }, // [[w:en:Wikipedia:Shortdesc_helper]]
        "exlinks": {
            script: "w:en:MediaWiki:Gadget-exlinks.js",
            wiki: ["enwiki"],
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
        }
    };
    const SCRIPTNAME = "User:DinhHuy2010/global.js";

    function isTalkNamespace(n: number): boolean {
        return n >= 0 && n % 2 === 1;
    }

    function toContentNamespace(n: number): number {
        if (isTalkNamespace(n)) {
            return n - 1; // Convert talk namespace to content namespace
        }
        return n; // Return the same namespace if it's not a talk namespace
    }

    function loadCascadiaMonoFont(): void {
        console.log(`[${SCRIPTNAME}]: Loading Cascadia Mono font...`);

        const link = document.createElement("link");
        // Preconnect to Google Fonts for performance
        link.rel = "preconnect";
        link.href = "https://fonts.googleapis.com";
        jq("head").append(link);

        const l2 = document.createElement("link");
        l2.rel = "stylesheet";
        l2.href = "https://fonts.gstatic.com";
        l2.crossOrigin = "anonymous";
        jq("head").append(l2);

        const fl = document.createElement("link");
        fl.rel = "stylesheet";
        fl.href = CASCADIA_MONO_FONT_URL.toString();
        jq("head").append(fl);
    }

    function loadUserScript(name: string, script: UserScriptRecord): void {
        function execute() {
            if (typeof script.script === "string") {
                importScript(script.script);
            } else if (typeof script.script === "function") {
                script.script();
            }
        }

        let on: string;
        if (script.wiki === "*") {
            on = "all Wikimedia projects";
        } else {
            on = `on ${script.wiki.join(", ")}`;
        }

        console.log(`[${SCRIPTNAME}]: Loading userscript ${on}: ${name}`);
        if (
            script.wiki.includes(mw.config.get("wgDBname")) ||
            script.wiki === "*" || script.wiki.includes("*")
        ) {
            // If the current wiki is in the list or the script is for all wikis
            execute();
        } else {
            // If the script is not for the current wiki, skip execution
            console.warn(
                `[${SCRIPTNAME}]: Skipping ${name} as it is not applicable to ${
                    mw.config.get("wgDBname")
                }.`,
            );
        }
    }

    function loadOnGlobal(): void {
        console.log(
            `[${SCRIPTNAME}]: Loading global userscripts/gadgets on Wikimedia projects...`,
        );
        loadCascadiaMonoFont();
        Object.entries(USERSCRIPTS).forEach(([name, script]) => {
            loadUserScript(name, script);
        });
    }

    function loadOnEnglishWikipedia(): void {
        console.log(
            `[${SCRIPTNAME}]: Loading English Wikipedia specific userscripts...`,
        );

        // Change some text on the English Wikipedia
        jq("#ca-talk a").text("Discussion");
        jq("#siteSub").text(
            "From Wikipedia, the free encyclopedia that anyone can edit",
        );
        jq(".vector-main-menu-action-opt-out").hide();
        if (mw.config.get("wgNamespaceNumber") === 6) {
            jq("#ca-view-foreign a").text("View on Wikimedia Commons");
            jq("#ca-fileExporter a").text("Transfer to Wikimedia Commons");
        }
    }
    function setDisamLabel() {
        console.log(`[${SCRIPTNAME}]: Setting disambiguation label...`);
        jq("#ca-nstab-main a").text("Disambiguation page");
    }
    function setDisamLabelIfNeeded() {
        const query = structuredClone(DISAMBIGUATION_PAGE_API_QUERY);
        const contentNS = toContentNamespace(NS);
        const api = new mw.Api();
        query.titles = `${mw.config.get("wgFormattedNamespaces")[contentNS]}:${
            mw.config.get("wgTitle")
        }`;
        api.get(query).then((data) => {
            const isDisambig =
                data.query.pages[0].pageprops.disambiguation === "";
            if (isDisambig) {
                setDisamLabel();
            }
        });
    }

    loadOnGlobal();
    if (mediawiki.config.get("wgDBname") === "enwiki") {
        loadOnEnglishWikipedia();
    }

    if (NS >= 0 && !IS_IN_WIKIDATA_DATA_NAMESPACE) {
        mediawiki.loader.using(["mediawiki.api"]).then(setDisamLabelIfNeeded);
    }
})(jQuery, mediaWiki);
