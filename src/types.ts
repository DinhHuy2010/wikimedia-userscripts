import type {
    ApiParseParams,
    ApiQueryPagePropsParams,
    ApiQueryParams,
    CentralAuthApiQueryGlobalUserInfoParams,
} from "types-mediawiki/api_params";
import { FilterType } from "./filters/index.ts";
type UserScriptSourceInformation = {
    sourcewiki: string;
    title: string;
    ctype?: "text/javascript" | "text/css";
};

export type ScriptHandlerOrLocation =
    | string
    | (() => void | Promise<void>)
    | UserScriptSourceInformation;

// {<string>: {script: <string> | <function>, wiki: <wiki>}}
// If string, use importScript(<string>);
// Else, execute the function directly.
export type UserScriptRecord = {
    type: "internal" | "external";
    script: ScriptHandlerOrLocation;
    filter: FilterType;
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

export type {
    ApiParseParams,
    ApiQueryPagePropsParams,
    ApiQueryParams,
    CentralAuthApiQueryGlobalUserInfoParams,
};
