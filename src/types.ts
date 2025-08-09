import type {
    ApiParseParams,
    ApiQueryPagePropsParams,
    CentralAuthApiQueryGlobalUserInfoParams,
} from "types-mediawiki/api_params";

export type MediaWikiType = typeof mediaWiki;
export type WikiDBWildCardType = string[] | "*";

type ScriptHandlerOrLocation = string | (() => void);

// {<string>: {script: <string> | <function>, wiki: <wiki>}}
// If string, use importScript(<string>);
// Else, execute the function directly.
export type UserScriptRecord = {
    script: ScriptHandlerOrLocation;
    wiki: WikiDBWildCardType;
};
export type UserScriptsRecord = Record<string, UserScriptRecord>;

interface SSWikis {
    "*": () => void;
    [wiki: string]: () => void;
}

/**
 * @description Represents the global configuration for this userscript.
 * @public
 */
export interface Configuration {
    /**
     * @description A record of user scripts.
     * @type {UserScriptsRecord}
     */
    external_scripts: UserScriptsRecord;
    /**
     * @description A record of internal scripts.
     * @type {UserScriptsRecord}
     */
    internal_scripts: UserScriptsRecord;
    /**
     * @description A record of specific scripts to run on certain wikis.
     * @type {SSWikis}
     */
    specific_scripts_on_wikis: SSWikis;
    /**
     * @description Should logging be enabled?
     * @type {boolean}
     */
    logging: boolean;
}

export type {
    ApiParseParams,
    ApiQueryPagePropsParams,
    CentralAuthApiQueryGlobalUserInfoParams,
};
