import { WikiInfo, Wikis } from "./types.ts";

interface WikiFilter {
    group?: string;
}

let _cached: Wikis | null = null;
const url = new URL(
    "https://raw.githubusercontent.com/DinhHuy2010/wikimedia-userscripts/main/data/wikis.json",
);

export async function getWikis(opts?: WikiFilter): Promise<Wikis> {
    if (_cached !== null) return _cached;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch wikis.json");
    const data: Wikis = await res.json();
    _cached = data;
    if (opts?.group) {
        const filtered: Wikis = Object.fromEntries(
            Object.entries(data).filter(([_, info]) =>
                info.group === opts.group
            ),
        );
        return filtered;
    }
    return data;
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
