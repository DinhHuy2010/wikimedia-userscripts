// From DinhHuy2010/wikimedia-userscripts
// SPDX-License-Identifier: CC-BY-4.0 OR MIT
// See CC-BY-4.0.LICENSE.txt and MIT.LICENSE.txt at the root repository for details

import { assignInternal } from "../internal.ts";

const SOURCE =
    "https://raw.githubusercontent.com/DinhHuy2010/wikimedia-userscripts/main/data/i18n.json";

async function getMessages(): Promise<Record<string, string>> {
    const response = await fetch(SOURCE);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch messages: ${response.status} ${response.statusText}`,
        );
    }
    const data = await response.json();
    return data;
}

async function initMessages(): Promise<void> {
    console.log("Loading messages...");
    const messages = await getMessages();
    mw.messages.set(messages);
    console.log(mw.msg("mw-dhscript-i18n-messages-loaded"));
}

assignInternal({ initMessages });
