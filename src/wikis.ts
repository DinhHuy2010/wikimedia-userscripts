import { WikiInfo, Wikis } from "./types.ts";

let _cached: Wikis | null = null;
const url = new URL(
    "https://raw.githubusercontent.com/DinhHuy2010/wikimedia-userscripts/main/data/wikis.json"
);
export async function getWikis(): Promise<Wikis> {
    if (_cached !== null) return _cached;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch wikis.json");
    const data: Wikis = await res.json();
    _cached = data;
    return data;
}

export async function getDatabases(): Promise<string[]> {
    return Object.keys(await getWikis())
}

export async function getWikiInfo(db: string): Promise<WikiInfo | null> {
    const wikis = await getWikis();
    return wikis[db] || null;
}
