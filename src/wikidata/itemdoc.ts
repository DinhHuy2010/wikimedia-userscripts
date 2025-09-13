// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import { renderWikitext } from "../utils.ts";

const WIKITEXT =
    `{{Item documentation}}{{#switch:{{#invoke:Wikidata|formatStatementsE|item={{PAGENAME}}|property=p31|displayformat=raw|numval=1}}
|Q202444|Q12308941|Q11879590|Q3409032={{TP given name}}
|Q101352={{TP family name}}
|Q5398426={{TP television series}}
|{{#if:{{#property:P9753|from={{PAGENAME}}}}|{{TP lang}}}}
}}`;

export async function itemDoc(): Promise<void> {
    const $element = $("<div>", {
        id: "itemdoc",
        "class": "wikidata-item-documentation mw-parser-output",
    }).append(
        await renderWikitext(WIKITEXT, {
            "title": mw.config.get("wbEntityId") as string,
        }),
    );
    $(".wikibase-entitytermsview").append($element);
}
