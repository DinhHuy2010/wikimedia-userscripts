/**
 * @description This is main entry point for User:DinhHuy2010/global.js
 * @see https://www.mediawiki.org/wiki/Help:Extension:GlobalCssJs
 * @author DinhHuy2010
 * @license "CC-BY-4.0 OR MIT"
 */

/* Any JavaScript added to this page will be loaded on all wikis where you have an account (see [https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Extension:GlobalCssJs documentation]). */

import { DATABASE_NAME } from "./constants.ts";
import { dhoptions } from "./options.ts";
import { loadExternalUserScript } from "./modules/userscript-loader.ts";
import { log } from "./modules/utils.ts";

{
    /**
     * @description Initialize all external and internal user scripts.
     * @private
     */
    // deno-lint-ignore no-inner-declarations
    function init(): void {
        Object.entries(dhoptions.internal_scripts)
            .forEach(([name, record]) => {
                loadExternalUserScript(DATABASE_NAME, name, record, true);
            });
        Object.entries(dhoptions.external_scripts)
            .forEach(([name, record]) => {
                loadExternalUserScript(DATABASE_NAME, name, record, false);
            });
    }

    // deno-lint-ignore no-inner-declarations
    function load_specific_scripts_on_wikis() {
        // Load the specific script for all wikis, if it exists.
        dhoptions.specific_scripts_on_wikis["*"]();
        // Load the specific script for the current wiki, if it exists.
        dhoptions.specific_scripts_on_wikis[DATABASE_NAME] || (() => {})();
    }

    init();
    load_specific_scripts_on_wikis();
    log("Userscripts loaded successfully.");
}
