import { WikiInfo, Wikis } from "./types.ts";
import { warn } from "./utils.ts";

interface WikiFilter {
    group?: string;
}

const CACHE_KEY = "mw-dhscript-allwikisinfo";
const url = new URL(
    "https://raw.githubusercontent.com/DinhHuy2010/wikimedia-userscripts/main/data/wikis.json",
);

export async function getWikis(opts?: WikiFilter): Promise<Wikis> {
    let o = mw.storage.get(CACHE_KEY) as string | null | false;
    let d: Wikis;
    if (o === false) {
        warn("Storage is disabled!");
        o = null;
    }
    if (typeof o === "string") {
        d = JSON.parse(o) as Wikis;
    } else {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch wikis.json: ${res.status}`);
        }
        o = await res.text();
        try {
            d = JSON.parse(o);
        } catch (_) {
            throw new Error("Invalid JSON in wikis.json");
        }
        mw.storage.set(CACHE_KEY, o, 86400);
    }
    if (opts?.group) {
        return Object.fromEntries(
            Object.entries(d).filter(([_, info]) =>
                info.group === opts.group
            ),
        );
    }
    return d;
}

export async function getDatabases(opts?: WikiFilter): Promise<string[]> {
    return Object.keys(await getWikis(opts));
}

export function getDatabasesSync(opts?: WikiFilter): string[] {
    const s: string[] = [];
    getWikis(opts).then(
        (w) => {
            s.push(...Object.keys(w));
        },
    );
    return s;
}

export async function getWikiInfo(db: string): Promise<WikiInfo | null> {
    const wikis = await getWikis();
    return wikis[db] || null;
}
export function getWikiInfoSync(db: string): WikiInfo | null {
    const out: WikiInfo[] = [];
    const w = getWikiInfo(db);
    w.then((r) => {
        if (r !== null) {
            out.push(r);
        }
    });
    return out[0] || null;
}
