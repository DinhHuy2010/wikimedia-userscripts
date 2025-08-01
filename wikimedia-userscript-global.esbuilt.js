// User:DinhHuy2010/global.js
// This script is loaded on all Wikimedia projects.
// Copyright (c) 2025-present DinhHuy2010
// License: CC-BY-4.0
(() => {
  // wikimedia-userscript-global.ts
  ((jq, mediawiki) => {
    "use strict";
    const params = new URLSearchParams({
      family: "Cascadia Mono:ital@0;1",
      display: "swap"
    });
    const CASCADIA_MONO_FONT_URL = new URL(
      `https://fonts.googleapis.com/css2?${params.toString()}`
    );
    const DISAMBIGUATION_PAGE_API_QUERY = {
      "action": "query",
      "format": "json",
      "prop": "pageprops",
      "formatversion": "2",
      "ppprop": "disambiguation"
    };
    const NS = mediawiki.config.get("wgNamespaceNumber");
    const WIKIBASE_DATA_NS = [640, 120, 146, 0];
    const IS_IN_WIKIDATA_DATA_NAMESPACE = WIKIBASE_DATA_NS.includes(NS) && mediawiki.config.get("wgDBname") === "wikidatawiki";
    const IS_IN_SPECIAL_NAMESPACE = NS < 0;
    const USERSCRIPTS = {
      "XTools": { script: "mw:XTools/ArticleInfo.js", wiki: "*" },
      // [[mw:XTools]]
      "HotCat": { script: "mw:MediaWiki:Gadget-HotCat.js", wiki: "*" },
      // [[w:en:Wikipedia:HotCat]]
      "markblocked": {
        script: "w:en:MediaWiki:Gadget-markblocked.js",
        wiki: "*"
      },
      // [[w:en:Special:Gadgets#gadget-markblocked]]
      "purgetab": { script: "w:en:MediaWiki:Gadget-purgetab.js", wiki: "*" },
      // [[w:en:Special:Gadgets#gadget-purgetab]]
      "revisionjumper": {
        script: "w:de:MediaWiki:Gadget-revisionjumper.js",
        wiki: "*"
      },
      // [[w:en:User:DerHexer/revisionjumper]]
      "TwinkleGlobal": {
        script: "m:User:Xiplus/TwinkleGlobal/load.js",
        wiki: "*"
      },
      // [[m:User:Xiplus/TwinkleGlobal]]
      "exlinks": {
        script: "w:en:MediaWiki:Gadget-exlinks.js",
        wiki: ["enwiki"]
      },
      "ClaimMaps": {
        script: "d:User:Teester/ClaimMaps.js",
        wiki: ["wikidatawiki"]
      },
      "DisplayColourSwatches": {
        script: "d:User:Nikki/DisplayColourSwatches.js",
        wiki: ["wikidatawiki"]
      },
      "User:Lectrician1/embeds.js": {
        script: "d:User:Lectrician1/embeds.js",
        wiki: ["wikidatawiki"]
      },
      "User:Lockal/EditSum.js": {
        script: "d:User:Lockal/EditSum.js",
        wiki: ["wikidatawiki"]
      },
      "Ultraviolet": {
        script: "w:en:User:10nm/beta.js",
        wiki: ["enwiki"]
      },
      "CiteHighlighter": {
        script: "w:en:User:Novem Linguae/Scripts/CiteHighlighter.js",
        wiki: ["enwiki"]
      },
      "sectionLinks.js": {
        script: "w:en:User:Hilst/Scripts/sectionLinks.js",
        wiki: ["enwiki"]
      }
    };
    const SCRIPTNAME = "User:DinhHuy2010/global.js";
    function isTalkNamespace(n) {
      return n >= 0 && n % 2 === 1;
    }
    function toContentNamespace(n) {
      if (isTalkNamespace(n)) {
        return n - 1;
      }
      return n;
    }
    function loadCascadiaMonoFont() {
      console.log(`[${SCRIPTNAME}]: Loading Cascadia Mono font...`);
      const link = document.createElement("link");
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
    function renderWikitext(wt, opts) {
      const api = new mediawiki.Api();
      const html = api.parse(wt, opts);
      return html;
    }
    function loadUserScript(name, script) {
      function execute() {
        if (typeof script.script === "string") {
          importScript(script.script);
        } else if (typeof script.script === "function") {
          script.script();
        }
      }
      let on;
      if (script.wiki === "*") {
        on = "all Wikimedia projects";
      } else {
        on = `on ${script.wiki.join(", ")}`;
      }
      if (script.wiki.includes(mediawiki.config.get("wgDBname")) || script.wiki === "*" || script.wiki.includes("*")) {
        console.log(`[${SCRIPTNAME}]: Loading userscript ${on}: ${name}`);
        execute();
      } else {
        console.warn(
          `[${SCRIPTNAME}]: Skipping ${name} as it is not applicable to ${mediawiki.config.get("wgDBname")}.`
        );
      }
    }
    function loadOnGlobal() {
      console.log(
        `[${SCRIPTNAME}]: Loading global userscripts/gadgets on Wikimedia projects...`
      );
      loadCascadiaMonoFont();
      Object.entries(USERSCRIPTS).forEach(([name, script]) => {
        loadUserScript(name, script);
      });
    }
    function loadOnEnglishWikipedia() {
      console.log(
        `[${SCRIPTNAME}]: Loading English Wikipedia specific userscripts...`
      );
      const WIKITEXT = "From [[Wikipedia]], the free encyclopedia that anyone can edit";
      jq("#ca-talk a").text("Discussion");
      mediawiki.loader.using(["mediawiki.api"], () => {
        renderWikitext(WIKITEXT).then((html) => jq("#siteSub").html(html)).catch((err) => {
          console.error(
            `[${SCRIPTNAME}]: Error rendering wikitext:`,
            err
          );
        });
      });
      jq(".vector-main-menu-action-opt-out").hide();
      if (mediawiki.config.get("wgNamespaceNumber") === 6) {
        jq("#ca-view-foreign a").text("View on Wikimedia Commons");
        jq("#ca-fileExporter a").text("Transfer to Wikimedia Commons");
      }
    }
    function setDisamLabel() {
      console.log(`[${SCRIPTNAME}]: Setting disambiguation label...`);
      jq("li[id^='ca-nstab'] > a").text("Disambiguation page");
    }
    function setDisamLabelIfNeeded() {
      const query = structuredClone(DISAMBIGUATION_PAGE_API_QUERY);
      const contentNS = toContentNamespace(NS);
      const api = new mediawiki.Api();
      query.titles = `${mediawiki.config.get("wgFormattedNamespaces")[contentNS]}:${mediawiki.config.get("wgTitle")}`;
      api.get(query).then((data) => {
        const isDisambig = data.query.pages[0].pageprops.disambiguation === "";
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
    if (!IS_IN_SPECIAL_NAMESPACE && !IS_IN_WIKIDATA_DATA_NAMESPACE && !mediawiki.config.get("wgIsMainPage")) {
      jq("#siteSub").show();
    }
    console.log(`[${SCRIPTNAME}]: Userscripts loaded successfully.`);
  })(jQuery, mediaWiki);
})();
