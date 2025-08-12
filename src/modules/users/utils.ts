import { CentralAuthApiQueryGlobalUserInfoParams } from "../../types.ts";

export async function extractGlobalUserInfo(username: string): Promise<
    {
        home: string;
        name: string;
    } | null
> {
    const f = new mw.ForeignApi("https://meta.wikimedia.org/w/api.php");
    const params: CentralAuthApiQueryGlobalUserInfoParams = {
        "action": "query",
        "format": "json",
        "formatversion": "2",
        "meta": "globaluserinfo",
        "guiuser": username,
    };
    const out = await f.get(params);
    if (out.query.globaluserinfo.missing === true) {
        return null;
    }
    return {
        home: out.query.globaluserinfo.home,
        name: out.query.globaluserinfo.name,
    };
}
