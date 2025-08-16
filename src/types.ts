import type {
    ApiParseParams,
    ApiQueryPagePropsParams,
    ApiQueryParams,
    CentralAuthApiQueryGlobalUserInfoParams,
} from "types-mediawiki/api_params";

export type WikiDBWildCardType = string | string[] | RegExp;
type UserScriptSourceInformation = {
    sourcewiki: string;
    title: string;
    ctype?: "text/javascript" | "text/css";
}

export type ScriptHandlerOrLocation = string | (() => void) | UserScriptSourceInformation;

// {<string>: {script: <string> | <function>, wiki: <wiki>}}
// If string, use importScript(<string>);
// Else, execute the function directly.
export type UserScriptRecord = {
    type: "internal" | "external";
    script: ScriptHandlerOrLocation;
    wiki: WikiDBWildCardType;
};
export type UserScriptsRecord = Record<string, UserScriptRecord>;

/**
 * @description Represents the global configuration for this userscript.
 * @public
 */
export interface Configuration {
    /**
     * @description A record of scripts.
     * @type {UserScriptsRecord}
     */
    scripts: UserScriptsRecord;
    /**
     * @description Should logging be enabled?
     * @type {boolean}
     */
    logging: boolean;
}

interface WikiInfo {
    /**
     * @description Name of this wiki instance
     * @type {string}
     */
    label: string;
    /**
     * @description base site URL
     * @type {string}
     */
    url: string;
    /**
     * @description The group this wiki belongs to, e.g., "wiki"
     * @type {string}
     */
    group: string;
}

export type Wikis = Record<string, WikiInfo>;

export type {
    ApiParseParams,
    ApiQueryPagePropsParams,
    ApiQueryParams,
    CentralAuthApiQueryGlobalUserInfoParams,
};
