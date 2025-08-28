/**
 * @description This is main entry point for User:DinhHuy2010/global.js
 * @see https://www.mediawiki.org/wiki/Help:Extension:GlobalCssJs
 * @author DinhHuy2010
 * @license "CC-BY-4.0 OR MIT"
 */

/* Any JavaScript added to this page will be loaded on all wikis where you have an account (see [https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Extension:GlobalCssJs documentation]). */

// deno-lint-ignore-file no-inner-declarations

import { DATABASE_NAME } from "./constants.ts";
import { dhoptions } from "./options.ts";
import { loadExternalUserScript } from "./modules/userscript-loader.ts";
import { log } from "./utils.ts";

{
    /**
     * @description Initialize all external and internal user scripts.
     * @private
     */
    async function init(): Promise<void> {
        await Promise.all(
            Object.entries(dhoptions.scripts).map(([name, record]) => {
                if (record.type === "external") {
                    return loadExternalUserScript(DATABASE_NAME, name, record, false);
                } else {
                    return loadExternalUserScript(DATABASE_NAME, name, record, true);
                }
            })
        );
    }
    mw.loader.using([
        "mediawiki.util",
        "mediawiki.api",
        "mediawiki.Title",
        "mediawiki.storage",
    ], init);
    log("Userscripts loaded successfully.");
}
