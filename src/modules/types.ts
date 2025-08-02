import type {
    ApiParseParams,
    ApiQueryPagePropsParams,
} from "types-mediawiki/api_params";

type MediaWikiType = typeof mediaWiki;
// {<string>: {script: <string> | <function>, wiki: <wiki>}}
// If string, use importScript(<string>);
// Else, execute the function directly.
type UserScriptRecord = {
    script: string | (() => void);
    wiki: string[] | "*";
};
type UserScriptsRecord = Record<string, UserScriptRecord>;

export type {
    MediaWikiType,
    UserScriptRecord,
    UserScriptsRecord,
    ApiParseParams,
    ApiQueryPagePropsParams,
}
